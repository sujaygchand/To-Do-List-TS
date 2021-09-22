class TaskInput{
    templateElement : HTMLTemplateElement;
    hostElement : HTMLDivElement;
    formElement : HTMLFontElement;

    constructor() {
       this.templateElement = document.getElementById('task-input') as HTMLTemplateElement;
       
       if(this.templateElement === null)
        throw new Error("task-input does not exist in index as HTMLTemplateElement");

        this.hostElement = document.getElementById('app') as HTMLDivElement; 
        
        if(this.hostElement === null)
         throw new Error("app does not exist in index as HTMLDivElement");

        const importedNode = document.importNode(this.templateElement.content, true);

        this.formElement = importedNode.firstElementChild as HTMLFontElement;
        this.attach();
    }

    private attach(){
        this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
    }
}

const taskInput = new TaskInput();