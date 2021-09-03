class Tooltip {
  constructor(closeNotifierFunction, text) {
    this.closeNotifier = closeNotifierFunction;
    this.content = text;
  }
  closeTooltip = () => {
    this.detach();
    this.closeNotifier();
  };
  detach() {
    this.element.remove();
  }
  attach() {
    const tooltipElement = document.createElement("div");
    tooltipElement.className = "card";
    tooltipElement.textContent = this.content;
    tooltipElement.addEventListener("click", this.closeTooltip);
    this.element = tooltipElement;
    document.body.append(tooltipElement);
  }
}

class ProjectItem {
  hasActiveTooltip = false;

  constructor(id, updateProductListFunction, type) {
    this.id = id; // before calling method with (this.id)
    this.updateProductListHandler = updateProductListFunction;
    this.connectSwitchButton(type);
    this.connectMoreInfoButton();
  }

  showMoreInfoHandler() {
    if (this.hasActiveTooltip) {
      return;
    }
    const projectElement = document.getElementById(this.id);
    const tooltipText = projectElement.dataset.extraName;
    console.log(projectElement);
    console.log(projectElement.dataset);
    projectElement.dataset.wtf = "Test";
    console.log(projectElement.dataset);
    const tooltip = new Tooltip(() => {
      this.hasActiveTooltip = false;
    }, tooltipText);
    tooltip.attach();
    this.hasActiveTooltip = true;
  }

  connectMoreInfoButton() {
    const projectItemElement = document.getElementById(this.id);
    let moreInfoButton = projectItemElement.querySelector(
      "button:first-of-type"
    );
    moreInfoButton.addEventListener(
      "click",
      this.showMoreInfoHandler.bind(this)
    );
  }

  connectSwitchButton(type) {
    const projectItemElement = document.getElementById(this.id);
    let switchButton = projectItemElement.querySelector("button:last-of-type");
    switchButton = DOMHelper.clearEventListener(switchButton);
    switchButton.textContent = type == "active" ? "Finished" : "Activate";
    switchButton.addEventListener(
      "click",
      this.updateProductListHandler.bind(null, this.id)
    );
  }

  update(updateProjectListFunction, type) {
    this.updateProductListHandler = updateProjectListFunction;
    this.connectSwitchButton(type);
  }
}

class DOMHelper {
  static clearEventListener(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }
  static moveElement(elementId, elementDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(
      elementDestinationSelector
    );
    destinationElement.append(element);
  }
}

class ProjectList {
  projects = []; // JS representation of DOM NODEs
  constructor(type) {
    this.type = type;
    const prjItems = document.querySelectorAll(`#${type}-projects li`);
    for (const prjItem of prjItems) {
      this.projects.push(
        new ProjectItem(prjItem.id, this.removeProject.bind(this), this.type)
      ); //create JS representation of DOM NODEs
    }
  }

  setSwitchHandler(switchHandlerFunction) {
    this.switchHandler = switchHandlerFunction;
  }

  removeProject(projectId) {
    //  const projectIndex = this.projects.findIndex((p) => p.id === projectId); // alternative way
    //  this.projects.splice(projectIndex, 1);
    console.log(projectId);
    console.log(this.projects.filter((p) => p.id !== projectId));
    console.log(this.projects.find((p) => p.id === projectId));
    console.log(this.switchHandler);
    this.switchHandler(this.projects.find((p) => p.id === projectId));
    this.projects = this.projects.filter((p) => p.id !== projectId);
  }

  addProject(project) {
    console.log(project);
    this.projects.push(project); // finish of the removing product in JS
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.removeProject.bind(this), this.type);
  }
}

class App {
  static init() {
    const activeProjectList = new ProjectList("active");
    const finishedProjectList = new ProjectList("finished");
    activeProjectList.setSwitchHandler(
      finishedProjectList.addProject.bind(finishedProjectList)
    );
    finishedProjectList.setSwitchHandler(
      activeProjectList.addProject.bind(activeProjectList)
    );
  }
}

App.init();
