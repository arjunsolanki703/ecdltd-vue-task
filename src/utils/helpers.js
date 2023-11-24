// Function to format the price in EUR (de-DE)
export const formattedPrice = (price) => {
	// Using Intl.NumberFormat to format the price as currency in Euros
	return new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR",
	}).format(price);
};