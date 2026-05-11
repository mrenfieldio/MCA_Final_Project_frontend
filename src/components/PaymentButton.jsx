export default function PaymentButton({ setShowPostModal }) {

  const handlePayment = async () => {

    
    const alreadyPaid = localStorage.getItem("job_post_paid");

    
    if (alreadyPaid === "true") {
      setShowPostModal(true);
      return;
    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/payment/create-order/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: 1,
          }),
        }
      );

      const data = await response.json();

      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: "INR",
        name: "ProLinker",
        description: "Job Posting Payment",
        order_id: data.order_id,

        handler: async function (response) {

          
          await fetch(
            "http://localhost:8000/api/payment/verify-payment/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(response),
            }
          );

          
          localStorage.setItem("job_post_paid", "true");

          
          setShowPostModal(true);
        },

        theme: {
          color: "#4F46E5",
        },
      };

      const razor = new window.Razorpay(options);

      razor.open();

    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <button
      className="primary-btn"
      onClick={handlePayment}
    >
      Post new job
    </button>
  );
}