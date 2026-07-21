const search = document.querySelector("[data-publication-search]");

if (search) {
  const items = Array.from(document.querySelectorAll(".publication-item"));
  const groups = Array.from(document.querySelectorAll("[data-year-group]"));
  const empty = document.querySelector("[data-publication-empty]");

  search.addEventListener("input", () => {
    const query = search.value.trim().toLocaleLowerCase();

    items.forEach((item) => {
      item.hidden = query.length > 0 && !item.textContent.toLocaleLowerCase().includes(query);
    });

    groups.forEach((group) => {
      group.hidden = !Array.from(group.querySelectorAll(".publication-item")).some((item) => !item.hidden);
    });

    if (empty) empty.hidden = items.some((item) => !item.hidden);
  });
}
