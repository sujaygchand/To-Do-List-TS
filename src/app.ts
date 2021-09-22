class TaskInput{
    templateElement : HTMLTemplateElement;
    hostElement : HTMLDivElement;
    formElement : HTMLFontElement;
    titleInputElement : HTMLInputElement;
    descriptionInputElement : HTMLInputElement;
    effortInputElement : HTMLInputElement;

    constructor() {
       this.templateElement = document.getElementById('task-input') as HTMLTemplateElement;
       
       if(this.templateElement === null)
        throw new Error("task-input does not exist in index as HTMLTemplateElement");

        this.hostElement = document.getElementById('app') as HTMLDivElement; 
        
        if(this.hostElement === null)
         throw new Error("app does not exist in index as HTMLDivElement");

        const importedNode = document.importNode(this.templateElement.content, true);

        this.formElement = importedNode.firstElementChild as HTMLFontElement;
        this.formElement.id = "user-input";
        this.titleInputElement = this.formElement.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.formElement.querySelector("#description") as HTMLInputElement;
        this.effortInputElement = this.formElement.querySelector("#effort") as HTMLInputElement;
        

        if(!this.titleInputElement || !this.descriptionInputElement || !this.effortInputElement)
            throw new Error("Input element does not have correct id assigned");


        this.configure();
        this.attach();
    }

    private submitHandler(event : Event) {
        event.preventDefault();
        console.log(this.titleInputElement.value);
        
    }

    private configure() {
        this.formElement.addEventListener("submit", this.submitHandler.bind(this));
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
    }
}

const taskInput = new TaskInput();