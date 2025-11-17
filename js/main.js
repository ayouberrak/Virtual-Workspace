
let btnAdd = document.getElementById('btn-add');
let formulaire = document.getElementById('model-form');
let cancelBtn = document.getElementById('cancel-btn');
let photoInput = document.getElementById('Photo');
let photoPreview = document.getElementById('photoPreview');
let btnAddExpriances = document.getElementById('btn-Add-Expriances');
let exeperiancesContairer = document.getElementById('experiances-contairer');
let nextSilblingExperiances = document.getElementById('nextSilblingExperiances');
let form = document.getElementById('formulaire');
let workersContainer = document.getElementById('workers-container');


function closeModel() {
    formulaire.classList.add('hidden');
}

// cancel model 
cancelBtn.addEventListener('click', () => {
    closeModel();
});

// afficher model
btnAdd.addEventListener('click', () => {
    formulaire.classList.toggle('hidden');
});

// close model when click outside form
formulaire.addEventListener('click', (e) => {
    if (e.target === formulaire) {
        closeModel();
    }
    
});

// photo preview !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
photoInput.addEventListener('input', (e) => {
    let url = e.target.value;
    photoPreview.innerHTML = '';

    let img = document.createElement('img');
    img.src = url;
    img.className = 'w-full h-full object-cover rounded-full';

    img.onerror = () => {
        img.src = './public/images/default-Photo.jpg';
    };

    photoPreview.appendChild(img);
});

// add experiances
btnAddExpriances.addEventListener('click', () => {
    let container = document.createElement('div');
    container.className = 'mt-4';
    container.innerHTML = `
        <div class="mb-2 flex gap-2 items-center">
            <div class='w-[30rem]'>
                <label for="Entreprise" class="block mb-2 text-sm font-medium text-slate-200">Entreprise</label>
                <input type="text" name="Entreprise"
                    class="w-full px-4 py-3 text-gray-100 transition-all duration-200 ease-in-out bg-slate-700 border-0 rounded-lg outline-none focus:bg-slate-600 focus:ring-2 focus:ring-green-500">
            </div>
            <i class="fa-solid fa-trash-can text-red-600 hover:text-red-800 cursor-pointer mt-6 text-4xl"></i>
        </div>
        <div class="mb-2 flex gap-2 items-center">
            <div>
                <label for="DateFrom" class="block mb-2 text-sm font-medium text-slate-200">From</label>
                <input type="date" name="DateFrom"
                    class="w-full px-4 py-3 text-gray-100 transition-all duration-200 ease-in-out bg-slate-700 border-0 rounded-lg outline-none focus:bg-slate-600 focus:ring-2 focus:ring-green-500">
            </div>
            <div>
                <label for="DateTo" class="block mb-2 text-sm font-medium text-slate-200">To</label>
                <input type="date" name="DateTo"
                    class="w-full px-4 py-3 text-gray-100 transition-all duration-200 ease-in-out bg-slate-700 border-0 rounded-lg outline-none focus:bg-slate-600 focus:ring-2 focus:ring-green-500">
            </div>
        </div>
    `;
    exeperiancesContairer.insertBefore(container, nextSilblingExperiances.nextSibling);
});
// delete experiances
exeperiancesContairer.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-trash-can')) {
        let experiancesDiv = e.target.closest('div.mt-4');
        if (experiancesDiv) {
            exeperiancesContairer.removeChild(experiancesDiv);
        }
    }
});


let perosne ;
// fuction de add woker
form.addEventListener('submit', function (e) {
    e.preventDefault();
    let name = document.getElementById('name').value;
    let position = document.getElementById('role').value;
    let image = document.getElementById('Photo').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    

    if (!image) {
        image = './public/images/default-Photo.jpg';
    }


    // recuperer les exeprience
    let experiences = [];
    let experienceInputs = exeperiancesContairer.querySelectorAll('div.mt-4');
    experienceInputs.forEach(exp => {
        let entreprise = exp.querySelector('input[name="Entreprise"]').value;
        let dateFrom = exp.querySelector('input[name="DateFrom"]').value;
        let dateTo = exp.querySelector('input[name="DateTo"]').value;
        
        if (entreprise || dateFrom || dateTo) {
            experiences.push({
                entreprise: entreprise,
                dateFrom: dateFrom,
                dateTo: dateTo
            });
        }
    });

    perosne = {
        fullname: name,
        role: position,
        photo: image,
        email: email,
        phone: phone,
        experiances : experiences
    };
    console.log(perosne.experiances)
    afficherWorker(perosne);
    form.reset();
    photoPreview.innerHTML = ` <img src="./public/images/default-Photo.jpg" alt="default-Photo" class="w-24 h-24 rounded-full object-cover">`
    closeModel();
});
// aficher function
function afficherWorker(elements){
    let employe = JSON.parse(localStorage.getItem('employe')) || [];
        employe.push(elements);
    localStorage.setItem('employe', JSON.stringify(employe));

    let workerDiv = document.createElement('div');
    workerDiv.innerHTML = '';
     workerDiv.className ="w-full p-4 bg-slate-700 rounded-lg mb-4 text-center text-white";
    employe.forEach(items => {
         if (!items) return; 
        workerDiv.innerHTML = `
        <div class="w-24 h-24 mx-auto mb-4 worker">
            <img src="${items.photo}" alt="${items.fullname}" class="w-full h-full object-cover rounded-full" onerror="this.src='./public/images/default-Photo.jpg'">
        </div>
        <h4 class="text-lg font-semibold">${items.fullname}</h4>
        <p class="text-slate-300">${items.role}</p>
    `;
    });
   
    workersContainer.appendChild(workerDiv);

}
afficherWorker();

function aficherInfoWorker(){
    let cardEvents = document.getElementsByClassName('worker');
    cardEvents.addEventListener('click', e=>{
        
    })

}



// // locale storage
// function addtolocalestorage(employes) {
//     let employe = JSON.parse(localStorage.getItem('employe')) || [];
//     employe.push(employes);
//     localStorage.setItem('employe', JSON.stringify(employe));
// }


// // // fuction de aficher les information
// // let information = document.createElement('div');
// console.log(window.innerWidth)
// console.log(window.innerHeight)
// while(window.innerWidth < window.innerHeight){
//     alert('wertyui')
// }