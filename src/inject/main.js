console.log('hello world inject')
import SearchBarPop from "@/global-components/SearchBar"

document.addEventListener("keydown", function (e) {
    if (e.shiftKey && (e.code == 'Space')) {
        SearchBarPop({name: "inject"})
        e.preventDefault();
    }
});