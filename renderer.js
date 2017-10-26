document.querySelector('#notify').addEventListener('click', () => {
    let t = new Notification("Here I am", {body: '👋'})
    t.onclick = (e) => {
        console.log(e)
        let log = document.querySelector('#log');
        log.innerHTML += 'notification clicked <br/>';
    }
});