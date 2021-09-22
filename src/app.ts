/** Decorators */
function Autobind(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    const adjDescriptor : PropertyDescriptor = {
        configurable: true,

        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

class TaskInput{
    templateElement : HTMLTemplateElement;
    hostElement : HTMLDivElement;
    formElement : HTMLFontElement;
    titleInputElement : HTMLInputElement;
    descriptionInputElement : HTMLInputElement;
    effortInputElement : HTMLInputElement;

    constructor() {
       this.templateElement = document.getElementById('task-input') as HTMLTemplateElement;
       this.checkHTMLElementIsValid([this.templateElement], "task-input does not exist in index as HTMLTemplateElement");

        this.hostElement = document.getElementById('app') as HTMLDivElement; 
       this.checkHTMLElementIsValid([this.hostElement], "app does not exist in index as HTMLDivElement");

        const importedNode = document.importNode(this.templateElement.content, true);

        this.formElement = importedNode.firstElementChild as HTMLFontElement;
        this.formElement.id = "user-input";
        this.titleInputElement = this.formElement.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElement = this.formElement.querySelector("#description") as HTMLInputElement;
        this.effortInputElement = this.formElement.querySelector("#effort") as HTMLInputElement;
        this.checkHTMLElementIsValid([this.titleInputElement, this.descriptionInputElement, this.effortInputElement], "An input element does not have correct id assigned");

        this.configure();
        this.attach();
    }

    @Autobind
    private submitHandler(event : Event) {
        event.preventDefault();
        console.log(this.titleInputElement.value);
        
    }

    private configure() {
        this.formElement.addEventListener("submit", this.submitHandler);
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
    }

    private checkHTMLElementIsValid(elements : HTMLElement[], errorMessage : string) {
        for(const element in elements){
            
            if(element === null)
            throw new Error(errorMessage);
        }
    }
}

const taskInput = new TaskInput();