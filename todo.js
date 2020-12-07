let todo = prompt("What would you like to do?");
const todoList = ["Collect Chicken Eggs", "Clean garbage"];
while (todo !== "quit" && todo !== "q") {
    if (todo === "list") {
        console.log("************");
        for (let i = 0; i < todoList.length; i++) {
            console.log(`${i}: ${todoList[i]}`);
        }
        console.log("************");
    } else if (todo === "new") {
        const newTodo = prompt("What is the new todo?");
        todoList.push(newTodo);
        console.log(`${newTodo} added to the list`);
    } else if (todo === "delete") {
        const toDelete = parseInt(prompt("What (number) do you want to delete"));
        if(!Number.isNaN(toDelete)) {
            const deleted = todoList.splice(toDelete, 1);
            console.log(`${deleted} delete from the list`);
        } else {
            console.log("Unknown index");
        }
    }
    todo = prompt("What would you like to do?");
}
console.log("Ok you quit the app");