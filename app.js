// import {createHabitHTML} from "./createHabitHTML.js";

const createHabitBtn = document.querySelector(".top__habit");
const modal = document.querySelector(".container-modal");
const modalInput = document.querySelector(".modal__input");
const modalAccept = document.querySelector(".modal__accept");
const modalCancel = document.querySelector(".modal__cancel");
const habitsBox = document.querySelector(".habits-box");
const search = document.querySelector(".top__search");
const today = new Date().toISOString().slice(0, 10);

window.addEventListener("DOMContentLoaded", () => {
  const list = getList();
  for (const habit of list) {
    createHabitHTML(habit.name, habit.date);
  }
  const habitCalendar = document.querySelector('.habit__calendar');
  habitCalendar.addEventListener('mouseover',(e)=>{
    if (e.target.getAttribute("data-date")) console.log(e.target.getAttribute("data-date"))
  })
});

createHabitBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

modalAccept.addEventListener("click", () => {
  createHabitHTML(modalInput.value);
  modal.style.display = "none";
  modalInput.value = "";
});

modalInput.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    if (modalInput.value.trim().length !== 0) {
      createHabitHTML(modalInput.value);
      modal.style.display = "none";
      modalInput.value = "";
    }
  }
});

modalCancel.addEventListener("click", () => {
  modal.style.display = "none";
  modalInput.value = "";
});



// CLASE

class Habit {
  constructor({
    name,
    daysCompleted = [],
    btnLog,
    grid,
    iconOptions,
    options,
    deleteOption,
    habit,
    habitStatus,
  }) {
    this.name = name;
    (this.daysCompleted = daysCompleted),
      (this.btnLog = btnLog),
      (this.grid = grid),
      (this.iconOptions = iconOptions),
      (this.options = options),
      (this.deleteOption = deleteOption),
      (this.habit = habit),
      (this.habitStatus = habitStatus);

    this.btnLog.addEventListener("click", () => {
      const today = new Date().toISOString().slice(0, 10);
      const list = getList();

      if (!list.some((x) => x.name == this.name && x.date == today)) {
        list.map((day) => {
          if (day.name === this.name) {
            day.date.push(today);
          }
        });
        this.daysCompleted.push(today);
        localStorage.setItem("habits", JSON.stringify(list));
        this.logDay(today);
      }
    }),
      this.iconOptions.addEventListener("click", () => {
        this.options.classList.toggle("hidden");
      });

    this.deleteOption.addEventListener("click", () => {
      this.habit.remove();
      const list = getList();
      const index = list.findIndex(h => h.name == this.name);
      list.splice(index,1);
      localStorage.setItem("habits", JSON.stringify(list));
    });

    for (let day of this.daysCompleted) {
      this.logDay(day);
    }
  }

  logDay(dayToPaint) {
    this.grid.childNodes.forEach((day) => {
      const date = day.getAttribute("data-date");
      if (date === dayToPaint) {
        day.style.backgroundColor = "red";
      }
      this.habitStatus.textContent = `Total: ${this.daysCompleted.length}`;
    });
  }
}

function createHabitHTML(name, dates = []) {
  const habit = document.createElement("div");
  habit.classList.add("habit");

  const habitTop = document.createElement("div");
  habitTop.classList.add("habit__top");
  const habitTitle = document.createElement("div");
  habitTitle.classList.add("habit__title");
  habitTitle.textContent = name;
  const iconOptions = document.createElement("div");
  iconOptions.classList.add("habit__icon-options");
  iconOptions.textContent = ":";

  habitTop.append(habitTitle, iconOptions);

  const habitCalendar = document.createElement("div");
  habitCalendar.classList.add("habit__calendar");
  const habitMonths = document.createElement("div");
  habitMonths.classList.add("habit__months");
  const habitDays = document.createElement("div");
  habitDays.classList.add("habit__days");
  const habitGrid = document.createElement("div");
  habitGrid.classList.add("habit__grid");
  const habitBlank = document.createElement("div");
  habitBlank.classList.add("habit__blank");
  habitGrid.append(habitBlank);

  const firstOfYear = new Date(new Date().getFullYear(), 0, 1);
  for (let i = 0; i < 365; i++) {
    const habitSquare = document.createElement("div");
    habitSquare.classList.add("habit__square");
    const tooltip = document.createElement('div');
    tooltip.classList.add('habit__tooltip');
    const date = new Date(firstOfYear);
    date.setDate(date.getDate() + i);
    const isoDate = date.toISOString().slice(0, 10);
    tooltip.textContent = isoDate;
    habitSquare.setAttribute("data-date", isoDate);
    habitSquare.append(tooltip)
    habitGrid.append(habitSquare);
  }

  habitCalendar.append(habitMonths, habitDays, habitGrid);

  const habitBottom = document.createElement("div");
  habitBottom.classList.add("habit__bottom");
  const habitStatus = document.createElement("div");
  habitStatus.classList.add("habit__status");
  habitStatus.textContent = `Total: 0`;
  const habitLogBtn = document.createElement("button");
  habitLogBtn.classList.add("habit__log");
  habitLogBtn.setAttribute("type", "button");
  habitLogBtn.textContent = "Log today!";

  habitBottom.append(habitStatus, habitLogBtn);

  const habitOptions = document.createElement("div");
  habitOptions.classList.add("habit__options", "hidden");
  const habitEmbed = document.createElement("div");
  habitEmbed.classList.add("habit__embed");
  habitEmbed.textContent = "Embed";
  const habitDelete = document.createElement("div");
  habitDelete.classList.add("habit__delete");
  habitDelete.textContent = "Delete";

  habitOptions.append(habitEmbed, habitDelete);

  habit.append(habitTop, habitCalendar, habitBottom, habitOptions);
  habitsBox.append(habit);

  const newHabit = new Habit({
    name: name,
    btnLog: habitLogBtn,
    grid: habitGrid,
    iconOptions: iconOptions,
    options: habitOptions,
    deleteOption: habitDelete,
    habit: habit,
    daysCompleted: dates,
    habitStatus: habitStatus,
  });

  const list = getList();
  const objHabit = {
    name: name,
    date: dates,
  };

  if (list.every((day) => day.name != name)) {
    list.push(objHabit);
    console.log(objHabit);
    localStorage.setItem("habits", JSON.stringify(list));
  }

}

// search

search.addEventListener("keyup", (e) => {
  document.querySelectorAll(".habit__title").forEach((el) => {
    el.textContent.toLowerCase().includes(e.target.value.toLowerCase())
      ? el.parentNode.parentNode.classList.remove("hidden")
      : el.parentNode.parentNode.classList.add("hidden");
  });
});

//localstorage

function getList() {
  let list = localStorage.getItem("habits");
  return list ? JSON.parse(list) : [];
}
