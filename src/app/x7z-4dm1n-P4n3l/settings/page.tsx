"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Globe, Palette, Database, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSiteSettings, updateSiteSettings } from "@/actions/admin-actions";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    cnpj: "",
    address: "",
    phone: "",
    email: "",
    logo_url: "",
    favicon_url: "",
    primary_color: "#f43f5e",
    secondary_color: "#0f172a",
    font_family: "Montserrat",
    cart_item_scale: 1.0,
  });

  useEffect(() => {
    async function loadSettings() {
      const res = await getSiteSettings();
      if (res.success && res.settings) {
        setSettings(res.settings);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await updateSiteSettings(settings);
    if (res.success) {
      toast.success("Configurações atualizadas com sucesso!");
    } else {
      toast.error("Erro ao atualizar: " + res.error);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Configurações Gerais</h1>
          <p className="text-gray-500">Gerencie a identidade e dados globais da sua plataforma.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-brand-pink hover:bg-brand-pink/90 text-white gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="bg-gray-100 p-1 rounded-lg w-fit">
          <TabsTrigger value="company" className="gap-2 rounded-lg py-2">
            <Info className="h-4 w-4" /> Dados da Empresa
          </TabsTrigger>
          <TabsTrigger value="design" className="gap-2 rounded-lg py-2">
            <Palette className="h-4 w-4" /> Visual & Branding
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2 rounded-lg py-2">
            <Database className="h-4 w-4" /> Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-6">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle>Informações Institucionais</CardTitle>
              <CardDescription>Estes dados serão exibidos no rodapé e páginas legais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">CNPJ</label>
                  <Input 
                    value={settings.cnpj} 
                    onChange={(e) => setSettings({...settings, cnpj: e.target.value})} 
                    placeholder="00.000.000/0000-00" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail de Contato</label>
                  <Input 
                    value={settings.email} 
                    onChange={(e) => setSettings({...settings, email: e.target.value})} 
                    placeholder="contato@mimuus.com.br" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Endereço Completo</label>
                <Input 
                  value={settings.address} 
                  onChange={(e) => setSettings({...settings, address: e.target.value})} 
                  placeholder="Rua Exemplo, 123 - São Paulo/SP" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone / WhatsApp</label>
                <Input 
                  value={settings.phone} 
                  onChange={(e) => setSettings({...settings, phone: e.target.value})} 
                  placeholder="(11) 98888-7777" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle>Identidade Visual</CardTitle>
                <CardDescription>Personalize as cores e logotipos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Cor Primária 
                      <div className="w-3 h-3 rounded-full border border-gray-200" style={{backgroundColor: settings.primary_color}} />
                    </label>
                    <Input 
                      type="color"
                      className="h-10 p-1"
                      value={settings.primary_color} 
                      onChange={(e) => setSettings({...settings, primary_color: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Cor Secundária
                      <div className="w-3 h-3 rounded-full border border-gray-200" style={{backgroundColor: settings.secondary_color}} />
                    </label>
                    <Input 
                      type="color"
                      className="h-10 p-1"
                      value={settings.secondary_color} 
                      onChange={(e) => setSettings({...settings, secondary_color: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL do Logo</label>
                  <Input 
                    value={settings.logo_url} 
                    onChange={(e) => setSettings({...settings, logo_url: e.target.value})} 
                    placeholder="https://ik.imagekit.io/..." 
                  />
                  {settings.logo_url && (
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg flex items-center justify-center">
                      <img src={settings.logo_url} alt="Logo Preview" className="max-h-12 object-contain" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle>Tipografia</CardTitle>
                <CardDescription>Escolha a fonte principal do site.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Google Font (Nome)</label>
                  <Input 
                    value={settings.font_family} 
                    onChange={(e) => setSettings({...settings, font_family: e.target.value})} 
                    placeholder="Montserrat, Roboto, Inter..." 
                  />
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p style={{fontFamily: settings.font_family}} className="text-lg font-bold">Preview: O texto será assim.</p>
                  <p style={{fontFamily: settings.font_family}} className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle>Ajustes Técnicos</CardTitle>
              <CardDescription>Configurações de processamento e lógica.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Escala de Item do Carrinho (Global)</label>
                <Input 
                  type="number"
                  step="0.1"
                  value={settings.cart_item_scale} 
                  onChange={(e) => setSettings({...settings, cart_item_scale: parseFloat(e.target.value)})} 
                />
                <p className="text-xs text-gray-500 italic">Define o fator de escala nos cálculos de precificação e peso volumétrico.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
