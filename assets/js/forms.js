(function () {
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("contactSubmit");

  if (!form || !statusEl) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setStatus(message, type = "info") {
    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`;
  }

  function clearFieldErrors() {
    form.querySelectorAll(".input-error").forEach(field => {
      field.classList.remove("input-error");
    });
  }

  function markError(field) {
    if (field) {
      field.classList.add("input-error");
    }
  }

  function validateForm(data) {
    clearFieldErrors();

    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push("Please enter your full name.");
      markError(form.querySelector("#name"));
    }

    if (!data.email || !emailPattern.test(data.email.trim())) {
      errors.push("Please enter a valid email address.");
      markError(form.querySelector("#email"));
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push("Please enter a message with at least 10 characters.");
      markError(form.querySelector("#message"));
    }

    return errors;
  }

  function getFormData() {
    return {
      name: form.querySelector("#name")?.value || "",
      email: form.querySelector("#email")?.value || "",
      organisation: form.querySelector("#organisation")?.value || "",
      enquiryType: form.querySelector("#enquiryType")?.value || "General Enquiry",
      message: form.querySelector("#message")?.value || ""
    };
  }

  function buildMailtoUrl(data) {
    const mailto = form.dataset.mailto || "zurlica@zanzibaruniversity.ac.tz";

    const subject = `ZURLICA Enquiry: ${data.enquiryType}`;

    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Organisation: ${data.organisation || "Not provided"}`,
      `Enquiry Type: ${data.enquiryType}`,
      "",
      "Message:",
      data.message
    ].join("\n");

    return `mailto:${mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function submitToEndpoint(data) {
    const endpoint = form.dataset.endpoint;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Form submission failed.");
    }

    return response;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const data = getFormData();
    const errors = validateForm(data);

    if (errors.length) {
      setStatus(errors[0], "error");
      return;
    }

    const endpoint = form.dataset.endpoint;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    try {
      if (endpoint) {
        setStatus("Submitting your enquiry...", "info");
        await submitToEndpoint(data);
        setStatus("Thank you. Your enquiry has been submitted successfully.", "success");
        form.reset();
      } else {
        setStatus("Opening your email client...", "info");

        const mailtoUrl = buildMailtoUrl(data);
        window.location.href = mailtoUrl;

        setStatus(
          "Your email client should now open with the message prepared. If it does not, please email zurlica@zanzibaruniversity.ac.tz directly.",
          "success"
        );
      }
    } catch (error) {
      console.error(error);
      setStatus(
        "There was a problem submitting your enquiry. Please try again or email the lab directly.",
        "error"
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Enquiry";
      }
    }
  });

  form.addEventListener("input", clearFieldErrors);
})();
