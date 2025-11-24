// /// variable globales/////
let btnAdd = document.getElementById('btn-add');
let formulaireModal = document.getElementById('model-form');
let cancelBtn = document.getElementById('cancel-btn');
let photoInput = document.getElementById('Photo');
let photoPreviewDiv = document.getElementById('photoPreview');
let btnAddExperiences = document.getElementById('btn-Add-Experiences');
let experiencesContainer = document.getElementById('experiances-contairer');
let theForm = document.getElementById('formulaire');
let workersContainer = document.getElementById('workers-container');

const modalContainer = document.getElementById('modal-container');
const modalTitle = document.getElementById('modal-title');
const employeesList = document.getElementById('authorized-employees-list');
const noRoleMessage = document.getElementById('no-role-message');
const closeModalBtn = document.getElementById('close-modal-btn');

const containerReception = document.getElementById('container-reception');
const containerServeurs = document.getElementById('container-serveurs');
const containerSecurite = document.getElementById('container-securite');
const containerPersonnel = document.getElementById('container-personnel');
const containerArchives = document.getElementById('container-archives');
const containerConference = document.getElementById('container-conference');

const btnreception = document.getElementById('btn-reception');
const btnserveurs = document.getElementById('btn-salle-serveurs');
const btnsecurite = document.getElementById('btn-salle-securite');
const btnpersonnel = document.getElementById('btn-salle-personnel');
const btnarchives = document.getElementById('btn-salle-darchives');
const btnconference = document.getElementById('btn-salle-conference');

const searchInput = document.getElementById('search-worker');
const filterSelect = document.getElementById('filter-role');

const tempAlert = document.getElementById('temp-alert');

const MAX_WORKERS_ZONE = 5;

///// roles par zones /////
let roleInReceprion = ["Receptionnistes", "Manager", "Nettoyage"];
let roleInServeurs = ["Techniciens IT", "Manager", "Nettoyage"];
let roleInSecurite = ["Agents de securite", "Manager", "Nettoyage"];
let roleInPersonnel = ["Agents de securite", "Manager", "Nettoyage", "Autres roles", "Techniciens IT", "Receptionnistes"];
let roleInArchives = ["Manager"];
let roleInConference = ["Agents de securite", "Manager", "Nettoyage", "Autres roles", "Techniciens IT", "Receptionnistes"];



// /// alert message /////
function afficherAlerteRapide(msg, dur = 3000) {
    if (tempAlert.timeout) {
        clearTimeout(tempAlert.timeout);
    }

    tempAlert.innerText = msg;
    tempAlert.classList.remove('hidden');
    tempAlert.style.opacity = '1';

    tempAlert.timeout = setTimeout(() => {
        tempAlert.style.opacity = '0';
        setTimeout(() => {
            tempAlert.classList.add('hidden');
        }, 300);
    }, dur);
}

///// close and open modal
btnAdd.addEventListener('click', () => {
    formulaireModal.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    formulaireModal.classList.add('hidden');
});

closeModalBtn.addEventListener('click', () => {
    modalContainer.style.display = 'none';
});

///// image preview/////
photoInput.addEventListener('input', (e) => {
    photoPreviewDiv.innerHTML = '';
    let img = document.createElement('img');
    img.className = 'w-full h-full object-cover';
    img.onerror = () => {
        img.src = './public/images/default-Photo.jpg';
    };
    img.src = e.target.value;
    photoPreviewDiv.appendChild(img);
});
//// serach call /////

if (searchInput && filterSelect) {
    searchInput.addEventListener('input', () => {
        updateInterface()
    });
    filterSelect.addEventListener('change', () => {
        updateInterface()
    });
}


/////// error rejex//////
function montrerErreurValidation(inp, msg, check) {
    const previousError = inp.nextElementSibling;
    if (previousError && previousError.classList.contains('error-message')) {
        previousError.remove();
    }

    if (!check) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-xs mt-1';
        errorDiv.textContent = msg;

        inp.parentNode.insertBefore(errorDiv, inp.nextSibling);

        inp.classList.add('border-red-500');
        return false;
    } else {
        inp.classList.remove('border-red-500');
        return true;
    }
}
////// model submit///////
theForm.addEventListener('submit', function (e) {
    e.preventDefault();

    //// rejex validation ////

    const nameRegEx = /^[a-zA-Z\s]{2,}$/;
    const emailRegEx = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegEx = /^(06|07)\d{8}$/;
    const entrepriseRegEx = /^[a-zA-Z0-9\s.']{2,}$/;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    const isNameValid = montrerErreurValidation(nameInput, ' Minimum 2 caracteres', nameRegEx.test(nameInput.value));
    const isEmailValid = montrerErreurValidation(emailInput, ' Format d email invalide', emailRegEx.test(emailInput.value));
    const isPhoneValid = montrerErreurValidation(phoneInput, ' Numero de telephone invalide.', phoneRegEx.test(phoneInput.value));



    let isExperienceValid = true;
    let experiences = [];


    ////// experiance add ////
    document.querySelectorAll('#experiances-contairer > div').forEach(div => {
        let entInput = div.querySelector('input[name="Entreprise"]');
        let dFrom = div.querySelector('input[name="DateFrom"]').value;
        let dTo = div.querySelector('input[name="DateTo"]').value;
        let entValue = entInput.value;


        if (entValue && !entrepriseRegEx.test(entValue)) {
            montrerErreurValidation(entInput, ' Nom de l entreprise invalide.', entrepriseRegEx.test(entInput));
            isExperienceValid = false;
        } else if (entValue) {
            montrerErreurValidation(entInput, '', true);
        }

        if (entValue && dFrom && dTo) {
            experiences.push({
                entreprise: entValue,
                dateFrom: dFrom,
                dateTo: dTo
            });
        }
    });


    ///// spot submit //////
    if (!isNameValid && !isEmailValid && !isPhoneValid && !isExperienceValid) {
        return;
    }


    //// add new worker ////
    let name = nameInput.value;
    let position = document.getElementById('role').value;
    let image = document.getElementById('Photo').value;
    if (!image) {
        image = './public/images/default-Photo.jpg'
    };

    let email = emailInput.value;
    let phone = phoneInput.value;

    let newWorker = {
        id: Date.now(),
        fullname: name,
        role: position,
        photo: image,
        email: email,
        phone: phone,
        experiences: experiences,
        zonesAsigned: null
    };

    //// localStorage//
    let employes = JSON.parse(localStorage.getItem('employe')) || [];
    employes.push(newWorker);
    localStorage.setItem('employe', JSON.stringify(employes));

    //// reset formulaire et close du modal////
    theForm.reset();
    photoPreviewDiv.innerHTML = `<img src="./public/images/default-Photo.jpg" alt="default-Photo" class="w-full h-full object-cover">`;
    experiencesContainer.innerHTML = '';

    formulaireModal.classList.add('hidden');
    afficherAlerteRapide('Employe Ajoute avec Succes!');
    updateInterface();
});

///// btn for add experiances //////
btnAddExperiences.addEventListener('click', () => {
    let div = document.createElement('div');
    div.className = 'mt-4 p-2 rounded-lg bg-gray-50';
    div.innerHTML = `
        <div class="mb-2 flex gap-2 items-center">
            <div class='flex-1'>
                <input type="text" name="Entreprise" placeholder="Entreprise" class="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg ">
            </div>
            <i class="fa-solid fa-trash-can text-red-600 cursor-pointer text-xl delete-exp hover:text-red-400"></i>
        </div>
        <div class="flex gap-2">
            <input type="date" name="DateFrom" class="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg ">
            <input type="date" name="DateTo" class="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg ">
        </div>
    `;
    div.querySelector('.delete-exp').addEventListener('click', () => {
        div.remove()
    });
    experiencesContainer.appendChild(div);
});
// ///// afichage des card dans les zones //////
function updateInterface() {
    workersContainer.innerHTML = "";
    containerReception.innerHTML = "";
    containerServeurs.innerHTML = "";
    containerSecurite.innerHTML = "";
    containerPersonnel.innerHTML = "";
    containerArchives.innerHTML = "";
    containerConference.innerHTML = "";

    let employes = JSON.parse(localStorage.getItem('employe')) || [];
    // console.log(employes);

    let searchTerm = "";
    let filterRole = "all";

    if (searchInput) {
        searchTerm = searchInput.value.toLowerCase();
    } else {
        searchTerm = "";
    }

    if (filterSelect) {
        filterRole = filterSelect.value;
    } else {
        filterRole = "all";
    }


    ///// filter ana zone is null /////
    employes.forEach(emp => {
        const matchesSearch = emp.fullname.toLowerCase().includes(searchTerm) || emp.role.toLowerCase().includes(searchTerm);
        const matchesRole = filterRole === 'all' || emp.role === filterRole;

        if (emp.zonesAsigned === null) {
            if (matchesSearch && matchesRole) {
                makeSidebarCard(emp);
            }
        } else {
            makeZoneCard(emp);
        }
        // console.log(emp);
    });

    ///// red zones /////
    checkZoneStatus(employes, 'Salle Serveurs', document.getElementById('big-container-serveurs'))
    checkZoneStatus(employes, 'Salle Securite', document.getElementById('big-container-securite'))
    checkZoneStatus(employes, 'Reception', document.getElementById('big-container-reception'))
    checkZoneStatus(employes, 'Salle d\'Archives', document.getElementById('big-container-archives'))
    checkZoneStatus(employes, 'Salle Personnel', document.getElementById('big-container-personnel'))
    checkZoneStatus(employes, 'Salle de Conference', document.getElementById('big-container-conference'))


}

// /// afichager des card dans sidbar ////

function makeSidebarCard(emp) {
    // console.log(emp)
    let card = document.createElement('div');
    card.className = "cursor-pointer px-8 py-2 bg-gray-100 rounded-lg text-gray-800 flex items-center justify-between transition-all cursor-pointer hover:bg-gray-200";
    card.dataset.id = emp.id;
    card.id = 'worker'
    // console.log(emp.id)

    card.innerHTML = `
        <img src="${emp.photo}" class="w-10 h-10 rounded-full object-cover" onerror="this.src='./public/images/default-Photo.jpg'">
        <div>
            <p class="font-bold text-sm">${emp.fullname}</p>
            <p class="text-gray-500 text-xs">${emp.role}</p>
        </div>
        <div class='deleteWorker'>
            <i class="fas fa-trash text-red-600 hover:text-red-800 cursor-pointer"></i>
        </div>
    `;

    /////// delete call///// 
    card.querySelector('.deleteWorker').addEventListener('click', e => {
        e.stopPropagation();
        if (confirm('vouler vous suprimer le worker ??')) {
            deleteEmployee(emp.id);
        }

    });
    card.addEventListener('click', () => {
        showWorkerDetails(emp)
    });
    workersContainer.appendChild(card);
}
// //// delete logique /////
function deleteEmployee(id_wkr) {
    let employes = JSON.parse(localStorage.getItem('employe')) || [];


    const initialLength = employes.length;
    employes = employes.filter(emp => emp.id !== id_wkr);

    if (employes.length < initialLength) {
        localStorage.setItem('employe', JSON.stringify(employes));
        afficherAlerteRapide('Employe Supprime avec Succes!');
        updateInterface();
    }
}

//////card in zone/////
function makeZoneCard(wkr) {
    // console.log(wkr);

    let card = document.createElement('div');
    card.className = "relative cursor-pointer max-w-[10rem] hover:scale-[1.02] transition";
    card.dataset.id = wkr.id
    // console.log(wkr.id);


    card.innerHTML = `

        <div class="hidden md:flex relative items-center gap-2 p-1 bg-white/90 rounded-lg w-auto"  >
            <img src="${wkr.photo}" 
                class="h-8 w-8 rounded-full object-cover "
                onerror="this.src='./public/images/default-Photo.jpg'">

            <div class='flex-1'>
                <h3 class="text-[0.6rem] font-bold text-gray-800 truncate">${wkr.fullname}</h3>
                <h3 class="text-[0.55rem] text-gray-600 ">${wkr.role}</h3>
            </div>

            <button class="delete-btn">
                 <i class="fas fa-trash text-red-600 hover:text-red-800 cursor-pointer"></i>
            </button>
        </div>
        <div class="flex md:hidden bg-white/90 rounded-sm"  >
            <img src="${wkr.photo}" 
                class="h-6 w-6 rounded-full object-cover "
                onerror="this.src='./public/images/default-Photo.jpg'">

            <div class='flex-1'>
                <h3 class="text-[0.4rem] font-bold text-gray-800 ">${wkr.fullname}</h3>
                <h3 class="text-[0.4rem] text-gray-600 ">${wkr.role}</h3>
            </div>

            <button class="delete-btn text-[0.7rem]">
                 <i class="fas fa-trash text-red-600 hover:text-red-800 cursor-pointer"></i>
            </button>
        </div>
    `;

    card.addEventListener('click', () => {
        showWorkerDetails(wkr)
    });

    card.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        changeEmployeeZone(wkr.id, null);
        afficherAlerteRapide(`Employe ${wkr.fullname} a ete desassigne.`);
    });


    // //zones if ...//
    if (wkr.zonesAsigned === "Reception") {
        containerReception.appendChild(card);
    } else if (wkr.zonesAsigned === "Salle Serveurs") {
        containerServeurs.appendChild(card);
    } else if (wkr.zonesAsigned === "Salle Securite") {
        containerSecurite.appendChild(card);
    } else if (wkr.zonesAsigned === "Salle Personnel") {
        containerPersonnel.appendChild(card);
    } else if (wkr.zonesAsigned === "Salle d'Archives") {
        containerArchives.appendChild(card);
    } else if (wkr.zonesAsigned === "Salle de Conference") {
        containerConference.appendChild(card);
    }
}

// /// zones worker///
function changeEmployeeZone(id, zoneName) {
    let employes = JSON.parse(localStorage.getItem('employe')) || [];
    for (let i = 0; i < employes.length; i++) {
        if (employes[i].id === id) {
            employes[i].zonesAsigned = zoneName;
            break;
        }
    }
    localStorage.setItem('employe', JSON.stringify(employes));
    updateInterface();
}


/// roles and zones afecter/////
function setupZoneButton(btn, roles, zone) {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        let employes = JSON.parse(localStorage.getItem('employe')) || [];
        const workersInZone = employes.filter(emp => emp.zonesAsigned === zone).length;

        // /// max/////
        if (workersInZone >= MAX_WORKERS_ZONE) {
            afficherAlerteRapide(`Impossible d'ajouter plus d'employes a ${zone}. Limite maximale de ${MAX_WORKERS_ZONE} employes atteinte.`, 4000);
            return;
        }

        modalContainer.style.display = 'flex';
        modalTitle.innerText = "Ajouter a : " + zone;
        employeesList.innerHTML = "";
        noRoleMessage.style.display = 'none';

        let found = false;

        employes.forEach(emp => {
            // /// roles in table for zones ///
            if (roles.includes(emp.role) && emp.zonesAsigned !== zone) {
                found = true;
                let div = document.createElement('div');
                div.className = "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition rounded-lg";

                ///// model demployee true ////
                div.innerHTML = `
                    <img src="${emp.photo}"
                        class="w-10 h-10 rounded-full object-cover "
                        onerror="this.src='./public/images/default-Photo.jpg'">

                    <div class="text-gray-900">
                        <p class="font-semibold text-sm">${emp.fullname}</p>
                        <p class="text-blue-600 text-xs">${emp.role}</p>
                    </div>
                `;
                //// worker add ///
                div.addEventListener('click', () => {
                    if (emp.zonesAsigned && emp.zonesAsigned !== zone) {
                        if (!confirm(`Voulez-vous le transférer vers ${zone} ?`))
                            return;
                    }
                    changeEmployeeZone(emp.id, zone);
                    afficherAlerteRapide(`Employe ${emp.fullname} assigne a ${zone}.`, 3000);
                    modalContainer.style.display = 'none';
                });
                employeesList.appendChild(div);
            }
        });

        // //// aucun////
        if (!found) {
            noRoleMessage.style.display = 'block';
        }
    });
}
// ///calll///
setupZoneButton(btnreception, roleInReceprion, "Reception");
setupZoneButton(btnserveurs, roleInServeurs, "Salle Serveurs");
setupZoneButton(btnsecurite, roleInSecurite, "Salle Securite");
setupZoneButton(btnpersonnel, roleInPersonnel, "Salle Personnel");
setupZoneButton(btnarchives, roleInArchives, "Salle d'Archives");
setupZoneButton(btnconference, roleInConference, "Salle de Conference");

// //// info de worker////
function showWorkerDetails(wkrDet) {
    let divInfo = document.createElement('div');
    divInfo.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4';

    let expListItems = '';

    if (wkrDet.experiences && wkrDet.experiences.length > 0) {
        expListItems = wkrDet.experiences.map(e => `
        <li class="mb-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition">
            <div class="text-sm text-gray-500 mb-1">${e.dateFrom} <span class="mx-1"> A </span> ${e.dateTo}</div>
            <div class="font-semibold text-gray-900 uppercase">${e.entreprise}</div>
        </li>
    `).join('');
    } else {
        expListItems = `<li class="text-gray-500 italic text-sm p-2">Aucun experience </li>`;
    }

    let zoneInfo = '';

    if (wkrDet.zonesAsigned) {
        zoneInfo = `
        <div class="mb-4 p-3 rounded-lg ">
            <p>
                <span class="text-blue-600 text-xs font-semibold">ZONE ASSIGNEE:</span>
                <span class="font-bold text-gray-900 text-lg block">${wkrDet.zonesAsigned}</span>
            </p>
        </div>
    `;
    } else {
        zoneInfo = '';
    }


    let modalContent = `
        <div class="bg-white rounded-2xl w-full max-w-md p-6 relative text-gray-900 ">

            <button id="close-info-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
                <i class="fa-solid fa-xmark text-2xl"></i>
            </button>

            <div class="flex gap-4 items-center mb-6 ">
                <img src="${wkrDet.photo}" class="w-20 h-20 rounded-full object-cover" onerror="this.src='./public/images/default-Photo.jpg'">
                <div>
                    <h2 class="text-xl font-bold">${wkrDet.fullname}</h2>
                    <p class="text-blue-500 font-semibold">${wkrDet.role}</p>
                </div>
            </div>
            ${zoneInfo}
            <div id="contact-info" class="mb-4 p-3 rounded-lg">
                <p class="mb-1"><span class="text-gray-500 text-xs font-semibold">email:</span> ${wkrDet.email}</p>
                <p><span class="text-gray-500 text-xs font-semibold">tel:</span> ${wkrDet.phone}</p>
            </div>

            <h3 class="mb-3 pb-1 font-bold text-lg">experiences</h3>
            <ul id="exp-list" class="max-h-40 overflow-y-auto pr-2 no-scrollbar">
                ${expListItems}
            </ul>
        </div>
    `;

    divInfo.innerHTML = modalContent;

    let closeModalInfoBtn = divInfo.querySelector('#close-info-modal');

    divInfo.addEventListener('click', (e) => {
        if (e.target === divInfo) {
            divInfo.remove()
        };
    });
    closeModalInfoBtn.addEventListener('click', () => {
        divInfo.remove();
    });

    document.body.appendChild(divInfo);
}

///// red zones////
function checkZoneStatus(employesArr, zoneName, containerDom) {
    let isAssigned = employesArr.some(e => e.zonesAsigned === zoneName);

    if (isAssigned) {
        containerDom.classList.remove('bg-red-900/40', 'hover:bg-red-500/50');
        containerDom.classList.add('bg-gray-900/40', 'hover:bg-green-500/50');
    } else {
        containerDom.classList.remove('bg-gray-900/40', 'hover:bg-green-500/50');
        containerDom.classList.add('bg-red-900/40', 'hover:bg-red-500/50');
    }
}


///init////
updateInterface();