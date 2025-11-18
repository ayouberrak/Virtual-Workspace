
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

let reception = document.getElementById('reception');
let serveurs = document.getElementById('salle-serveurs');
let securite = document.getElementById('salle-securite');
let personnel = document.getElementById('salle-personnel');
let archives = document.getElementById('salle-darchives');
let conference = document.getElementById('salle-conference');

let btnreception = document.getElementById('btn-reception');
let btnserveurs = document.getElementById('btn-salle-serveurs');
let btnsecurite = document.getElementById('btn-salle-securite');
let btnpersonnel = document.getElementById('btn-salle-personnel');
let btnarchives = document.getElementById('btn-salle-darchives');
let btnconference = document.getElementById('btn-salle-conference '); 

const modalContainer = document.getElementById('modal-container');
const modalTitle = document.getElementById('modal-title');
const employeesList = document.getElementById('authorized-employees-list');
const noRoleMessage = document.getElementById('no-role-message');
const closeModalBtn = document.getElementById('close-modal-btn');


let roleInReceprion = ["Réceptionnistes", "Manager", "Nettoyage"];
let roleInServeurs = ["Techniciens IT", "Manager", "Nettoyage"];
let roleInSecurite = ["Agents de sécurité", "Manager", "Nettoyage"];
let roleInPersonnel = ["Agents de sécurité", "Manager", "Nettoyage", "Autres rôles", "Techniciens IT", "Receptionnistes"];
let roleInArchives = ["Manager"];
let roleInConference = ["Agents de sécurité", "Manager", "Nettoyage", "Autres rôles", "Techniciens IT", "Receptionnistes"];



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


let worker;
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
    image.onerror = () =>{
        image.value = './public/images/default-Photo.jpg'
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
    function getId(){
        return  Date.now();
    }

    worker = {
        id:getId(),
        fullname: name,
        role: position,
        photo: image,
        email,
        phone,
        experiences
    };
    console.log(worker.id)
    console.log(worker.experiences)
    afficherWorker(worker);
    form.reset();
    photoPreview.innerHTML = ` <img src="./public/images/default-Photo.jpg" alt="default-Photo" class="w-24 h-24 rounded-full object-cover">`
    closeModel();
});
// aficher function
function afficherWorker(newWorker = null) {
    let employe = JSON.parse(localStorage.getItem('employe')) || [];
    if (newWorker) {
        employe.push(newWorker);
        localStorage.setItem('employe', JSON.stringify(employe));
    }
    workersContainer.innerHTML = "";
    employe.forEach(item => {
        if (!item) return;

        let card = document.createElement('div');
        card.className = "cursor-pointer mt-4 min-w-0 max-w-full p-4 bg-black rounded-lg mb-2 text-center text-white flex justify-start items-center gap-6 ";
        card.innerHTML = `
            <div class="w-16 h-16 worker cursor-pointer">
                <img src="${item.photo}" class="w-full h-full object-cover rounded-full" onerror="this.src='./public/images/default-Photo.jpg'">
            </div>
            <div>
                <h4 class="text-lg font-semibold">${item.fullname}</h4>
                <p class="text-slate-300">${item.role}</p>
            </div>
            <button class="text-white hover:text-black cursor-pointer">Edit</button>
        `;
        card.addEventListener('click', () => {
            afichierInfoWorker(item)
        });
        workersContainer.appendChild(card);
    });


}

function afichierInfoWorker(newwoker) {



    let divInfo = document.createElement('div');
    divInfo.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'
    divInfo.innerHTML = `
        <div class="bg-black/90 rounded-2xl w-[25rem] overflow-hidden relative h-auto">

            <div class="px-6 pb-6">
                <div class="flex gap-8 items-center">
                    <img src="${newwoker.photo}"
                        class="w-[7rem] h-[7rem] rounded-full border-4 object-cover mt-6 ">
                    <div>
                        <h2 class="text-2xl font-extrabold text-white mt-6">${newwoker.fullname}</h2>
                        <span class=" text-green-400 text-sm ">${newwoker.role}</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-16 my-4 text-sm text-slate-200">
                    <div class=" p-2 rounded">
                        <p class="text-slate-400 text-xs">EMAIL</p>${newwoker.email}
                    </div>
                    <div class=" p-2 rounded">
                        <p class="text-slate-400 text-xs">TEL</p>${newwoker.phone}
                    </div>
                </div>

                <h3 class="text-white font-bold mb-2 h-8 border-b  border-slate-600 ">Expériences</h3>
                <ol class="relative max-h-[13rem] overflow-y-auto pr-2 no-scrollbar list">
                    
                </ol>


            </div>
        </div>

    `
    document.body.appendChild(divInfo);
    newwoker.experiences.forEach(e => {
        let listExpeirances = divInfo.querySelector('.list');
        let list = document.createElement('li')
        list.className = "mb-4 ml-4"
        list.innerHTML = `
                        <time class="text-sm text-slate-400">${e.dateFrom} - ${e.dateTo}</time>
                        <h3 class="text-lg font-semibold text-white">${e.entreprise}</h3>
        `
        listExpeirances.appendChild(list)

    })

    divInfo.addEventListener('click', e => {
        e.target === divInfo && divInfo.remove()
    });


    
}




function EvnentListerForZone(btnToClick, ArrayRole, zoneName) {
    btnToClick.addEventListener('click', () => {
        
        employeesList.innerHTML = '';
        modalTitle.textContent = `Employés Autorisés pour : ${zoneName}`;
        noRoleMessage.style.display = 'none';

        let employe = JSON.parse(localStorage.getItem('employe')) || [];
        let authorizedEmployeesFound = false;

        employe.forEach(items => {
            if (ArrayRole.includes(items.role)) {
                authorizedEmployeesFound = true;

                let cardInZone = document.createElement('div');
                
                cardInZone.classList.add(
                    'border','border-gray-300','p-3','mb-3','flex','items-center',  'rounded-lg','shadow-sm',     'bg-white'
                );

                cardInZone.innerHTML = `
                    <img src='${items.photo}' alt='${items.fullname}' 
                        class='w-12 h-12 rounded-full mr-4 object-cover' 
                    >
                    <div>
                        <p class='m-0 font-semibold text-gray-800'>${items.fullname}</p>
                        <p class='m-0 text-sm text-gray-500'>${items.role}</p>
                    </div>
                `;
                employeesList.appendChild(cardInZone);
            }
        });

        if (!authorizedEmployeesFound) {
            noRoleMessage.style.display = 'block';
        }
        modalContainer.style.display = 'flex';
    });
}


EvnentListerForZone(btnreception, roleInReceprion, "Réception");
EvnentListerForZone(btnserveurs, roleInServeurs, "Salle Serveurs");
EvnentListerForZone(btnsecurite, roleInSecurite, "Salle Sécurité");
EvnentListerForZone(btnpersonnel, roleInPersonnel, "Salle Personnel");
EvnentListerForZone(btnarchives, roleInArchives, "Salle d'Archives");
EvnentListerForZone(btnconference, roleInConference, "Salle de Conférence");

closeModalBtn.addEventListener('click', () => {
    modalContainer.style.display = 'none';
});

modalContainer.addEventListener('click', (e) => {
    if (e.target.id === 'modal-container') {
        modalContainer.style.display = 'none';
    }
});

// function EvnentListerForZone(idToClick, ArrayRole) {
//     idToClick.addEventListener('click', () => {
//         // 1. Clear previous content in the clicked zone (optional)
//         idToClick.innerHTML = ''; 
        
//         // 2. Retrieve employee data
//         let employe = JSON.parse(localStorage.getItem('employe')) || [];
//         let authorizedEmployeesFound = false;

//         employe.forEach(items => {
//             if (ArrayRole.includes(items.role)) {
//                 authorizedEmployeesFound = true; 
                
//                 let cardInZone = document.createElement('div');
//                 cardInZone.classList.add('employee-card'); 
                
//                 cardInZone.innerHTML = `
//                     <img src='${items.photo}' alt='${items.name}' class='employee-photo'>
//                     <p class='employee-name'>${items.name}</p>
//                     <p class='employee-role'>${items.role}</p>
//                 `;
                
//                 idToClick.appendChild(cardInZone);
//             }
//         });

//         if (!authorizedEmployeesFound) {
//             let noRoleMessage = document.createElement('p');
//             noRoleMessage.textContent = "Il n'y a aucun employé autorisé ici.";
//             idToClick.appendChild(noRoleMessage);
//         }
//     });
// }








afficherWorker();




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