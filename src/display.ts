
export const display = ({ presentDialog, chooseOption }, element: HTMLElement) => {
    console.log("DISPLAY");
    const dialog = presentDialog()
    element.innerHTML = `
        <div class="intro">
        <p>${dialog.intro}</p>
        </div>
        <ol>
    `+ dialog.options.map(option => `<li>${option}</li>`).join('') + '</ol>';
    element.querySelectorAll('li').forEach((li, i) => li.addEventListener('click', (ev) => {
        console.log(i);
        chooseOption(i);
        display({ presentDialog, chooseOption }, element)
    }))

}

