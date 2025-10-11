// POST /api/customers/import-installment
router.post("/import-installment", async (req, res) => {
    try {
        const { customerId, name, installment } = req.body;
        if (!customerId || !installment) return res.status(400).json({ error: "Missing fields" });

        const customer = await Customer.findOne({ customerId });
        if (customer) {
            // push installment
            customer.installments.push(installment);
            customer.receivedAmount = (Number(customer.receivedAmount || 0) + Number(installment.receivedAmount || 0));
            customer.balanceAmount = (Number(customer.totalAmount || 0) - (Number(customer.bookingAmount || 0) + Number(customer.receivedAmount || 0)));
            await customer.save();
            return res.json(customer);
        } else {
            // create new customer
            const newCust = new Customer({
                customerId,
                name: name || "Unknown",
                installments: [installment],
                totalAmount: installment.totalAmount || 0,
                bookingAmount: installment.bookingAmount || 0,
                receivedAmount: installment.receivedAmount || 0
            });
            newCust.balanceAmount = (Number(newCust.totalAmount || 0) - (Number(newCust.bookingAmount || 0) + Number(newCust.receivedAmount || 0)));
            await newCust.save();
            return res.status(201).json(newCust);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
