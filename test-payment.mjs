import fs from "fs";

const testLowAmount = async () => {
  const res = await fetch('http://localhost:3000/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{name:"Test", price: 4.00, quantity: 1}], orderId: "test-123", customer_email: "test@example.com", customer_name: "John Doe" })
  });
  const text = await res.text();
  fs.writeFileSync("test-output-utf8.txt", text + "\n", { encoding: "utf8", flag: "a" });
}

const testHighAmount = async () => {
  const res = await fetch('http://localhost:3000/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{name:"Test", price: 10.00, quantity: 1}], orderId: "test-123", customer_email: "test@example.com", customer_name: "John Doe" })
  });
  const text = await res.text();
  fs.writeFileSync("test-output-utf8.txt", text + "\n", { encoding: "utf8", flag: "a" });
}

fs.writeFileSync("test-output-utf8.txt", "", { encoding: "utf8" });
testLowAmount().then(testHighAmount);
