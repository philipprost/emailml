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
    document.getElementById("html-output").textContent =
      html_beautify(transformedHtml);
    document.getElementById("html-render").srcdoc = transformedHtml;
    hljs.highlightAll();
  } else {
    console.error("Failed to transform EmailML");
  }
}
