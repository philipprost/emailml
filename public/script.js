async function transform() {
  const emailml = document.getElementById("emailml-input").value;

  const response = await fetch("/transform", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emailml }),
  });

  if (response.ok) {
    const data = await response.json();
    const transformedHtml = data.html;
    document.getElementById("html-output").textContent = transformedHtml;
    document.getElementById("html-render").srcdoc = transformedHtml;
  } else {
    console.error("Failed to transform EmailML");
  }
}
