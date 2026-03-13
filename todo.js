const ul = document.querySelector('#lists');
const form = document.querySelector('form');


/* The code snippet you provided is an event listener attached to the form element that listens for a
form submission event. When the form is submitted, the event handler function is executed. Here's a
breakdown of what the code is doing: */
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = document.querySelector('#text');
    const li = document.createElement('li');

    li.innerHTML = `<input type="checkbox" name="complete" />${task.value}`;
    ul.append(li);

    form.reset();
});


/* This code snippet is adding a click event listener to the `<ul>` element. When a click event occurs
within the `<ul>` element, the event handler function is executed. */
ul.addEventListener('click', (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
        const checkbox = e.target;
        const li = checkbox.parentElement;
        if (checkbox.checked && li) {
            setTimeout(() => li.remove(), 500);
        }
    }
});