let btnAdd = document.getElementById('btn-add');
let formulaire = document.getElementById('model-form');
let cancelBtn = document.getElementById('cancel-btn');
let photoInput = document.getElementById('Photo');
let photoPreview = document.getElementById('photoPreview');
let btnAddExperiences = document.getElementById('btn-Add-Experiences'); 
let experiencesContainer = document.getElementById('experiances-contairer'); 
let form = document.getElementById('formulaire');
let workersContainer = document.getElementById('workers-container');

// Elements du Modal d'Assignation (Zone)
const modalContainer = document.getElementById('modal-container');
const modalTitle = document.getElementById('modal-title');
const employeesList = document.getElementById('authorized-employees-list');
const noRoleMessage = document.getElementById('no-role-message');
const closeModalBtn = document.getElementById('close-modal-btn');

// Containers des Zones
const containerReception = document.getElementById('container-reception');
const containerServeurs = document.getElementById('container-serveurs');
const containerSecurite = document.getElementById('container-securite');
const containerPersonnel = document.getElementById('container-personnel');
const containerArchives = document.getElementById('container-archives');
const containerConference = document.getElementById('container-conference');

// Boutons des Zones
const btnreception = document.getElementById('btn-reception');
const btnserveurs = document.getElementById('btn-salle-serveurs');
const btnsecurite = document.getElementById('btn-salle-securite');
const btnpersonnel = document.getElementById('btn-salle-personnel');
const btnarchives = document.getElementById('btn-salle-darchives');
const btnconference = document.getElementById('btn-salle-conference');

// Nouveaux عناصر البحث والفيلتر
const searchInput = document.getElementById('search-worker');
const filterSelect = document.getElementById('filter-role');

// **جديد: عنصر التنبيه المؤقت (Non-blocking)**
const tempAlert = document.getElementById('temp-alert');

// **CONSTANTE : الحد الأقصى للعمال في كل منطقة**
const MAX_WORKERS_PER_ZONE = 5;

// Rôles autorisés par zone
let roleInReceprion = ["Réceptionnistes", "Manager", "Nettoyage"];
let roleInServeurs = ["Techniciens IT", "Manager", "Nettoyage"];
let roleInSecurite = ["Agents de sécurité", "Manager", "Nettoyage"];
let roleInPersonnel = ["Agents de sécurité", "Manager", "Nettoyage", "Autres rôles", "Techniciens IT", "Réceptionnistes"];
let roleInArchives = ["Manager"];
let roleInConference = ["Agents de sécurité", "Manager", "Nettoyage", "Autres rôles", "Techniciens IT", "Réceptionnistes"];


// --- Fonction d'affichage des alertes non-bloquantes ---
function showTempAlert(message, duration = 3000) {
    if (tempAlert.timeout) {
        clearTimeout(tempAlert.timeout);
    }
    
    tempAlert.innerText = message;
    tempAlert.classList.remove('hidden');
    tempAlert.style.opacity = '1';

    // إخفاء التنبيه بعد المدة المحددة
    tempAlert.timeout = setTimeout(() => {
        tempAlert.style.opacity = '0';
        setTimeout(() => {
            tempAlert.classList.add('hidden');
        }, 300); 
    }, duration);
}


// --- Event Listeners pour les modales de base ---
btnAdd.addEventListener('click', () => {
    formulaire.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    formulaire.classList.add('hidden');
});

closeModalBtn.addEventListener('click', () => {
    modalContainer.style.display = 'none';
});

photoInput.addEventListener('input', (e) => {
    photoPreview.innerHTML = '';
    let img = document.createElement('img');
    img.className = 'w-full h-full object-cover';
    img.onerror = () => {
        img.src = './public/images/default-Photo.jpg';
    };
    img.src = e.target.value;
    photoPreview.appendChild(img);
});

// Événements de recherche et de filtrage
if (searchInput && filterSelect) {
    searchInput.addEventListener('input', () => refreshUI());
    filterSelect.addEventListener('change', () => refreshUI());
}


// --- Soumission du formulaire d'ajout d'employé ---
form.addEventListener('submit', function (e) {
    e.preventDefault();

    let name = document.getElementById('name').value;
    let position = document.getElementById('role').value;
    let image = document.getElementById('Photo').value;
    if (!image) image = './public/images/default-Photo.jpg';

    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;

    let experiences = [];
    document.querySelectorAll('#experiances-contairer > div').forEach(div => {
        let ent = div.querySelector('input[name="Entreprise"]').value;
        let dFrom = div.querySelector('input[name="DateFrom"]').value;
        let dTo = div.querySelector('input[name="DateTo"]').value;
        if (ent && dFrom && dTo) {
            experiences.push({ entreprise: ent, dateFrom: dFrom, dateTo: dTo });
        }
    });

    let worker = {
        id: Date.now(),
        fullname: name,
        role: position,
        photo: image,
        email: email,
        phone: phone,
        experiences: experiences,
        zonesAsigned: null
    };

    let employes = JSON.parse(localStorage.getItem('employe')) || [];
    employes.push(worker);
    localStorage.setItem('employe', JSON.stringify(employes));

    form.reset();
    photoPreview.innerHTML = `<img src="./public/images/default-Photo.jpg" alt="default-Photo" class="w-full h-full object-cover">`; 
    experiencesContainer.innerHTML = '';
    
    formulaire.classList.add('hidden');
    refreshUI();
});


// --- Gestion de l'ajout d'expérience professionnelle ---
btnAddExperiences.addEventListener('click', () => {
    let div = document.createElement('div');
    div.className = 'mt-4';
    div.innerHTML = `
        <div class="mb-2 flex gap-2 items-center">
            <div class='flex-1'><input type="text" name="Entreprise" placeholder="Entreprise" class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></div>
            <i class="fa-solid fa-trash-can text-red-600 cursor-pointer text-xl delete-exp hover:text-red-400"></i>
        </div>
        <div class="flex gap-2">
            <input type="date" name="DateFrom" class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <input type="date" name="DateTo" class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
        </div>
    `;
    div.querySelector('.delete-exp').addEventListener('click', () => div.remove());
    experiencesContainer.appendChild(div);
});


// --- Fonction de rafraîchissement de l'interface utilisateur (UI) ---
function refreshUI() {
    workersContainer.innerHTML = "";
    containerReception.innerHTML = "";
    containerServeurs.innerHTML = "";
    containerSecurite.innerHTML = "";
    containerPersonnel.innerHTML = "";
    containerArchives.innerHTML = "";
    containerConference.innerHTML = "";

    let employes = JSON.parse(localStorage.getItem('employe')) || [];
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const filterRole = filterSelect ? filterSelect.value : 'all';

    employes.forEach(emp => {
        const matchesSearch = emp.fullname.toLowerCase().includes(searchTerm) || emp.role.toLowerCase().includes(searchTerm);
        const matchesRole = filterRole === 'all' || emp.role === filterRole;

        if (emp.zonesAsigned === null) {
            // Affichage dans la sidebar (filtré)
            if (matchesSearch && matchesRole) {
                createSidebarCard(emp);
            }
        } else {
            // Affichage sur la carte (non filtré)
            createZoneCard(emp);
        }
    });
}


// --- Création des cartes ---
function createSidebarCard(emp) {
    let card = document.createElement('div');
    card.className = "cursor-pointer p-2 bg-gray-100 rounded-lg text-gray-800 flex items-center gap-4 border border-gray-100 hover:border-blue-500 transition-all cursor-pointer hover:bg-gray-200";
    // *** تم إزالة: draggable="true" ***

    card.innerHTML = `
        <img src="${emp.photo}" class="w-10 h-10 rounded-full object-cover" onerror="this.src='./public/images/default-Photo.jpg'">
        <div>
            <p class="font-bold text-sm">${emp.fullname}</p>
            <p class="text-gray-500 text-xs">${emp.role}</p>
        </div>
    `;
    card.addEventListener('click', () => afichierInfoWorker(emp));
    workersContainer.appendChild(card);
}

function createZoneCard(emp) {
    let card = document.createElement('div');
    // **بطاقة مصغرة**
    card.className = "relative cursor-pointer max-w-[8rem] hover:scale-[1.02] transition"; 
    // *** تم إزالة: draggable="true" ***
    
    card.innerHTML = `
        <div class="relative flex items-center gap-2 p-1 bg-white/90 rounded-lg shadow-md border border-gray-200">
            <img src="${emp.photo}" 
                class="h-8 w-8 rounded-full object-cover border-2 border-green-500"
                onerror="this.src='./public/images/default-Photo.jpg'">

            <div class='flex-1'>
                <h3 class="text-[0.6rem] font-bold text-gray-800 truncate">${emp.fullname}</h3>
                <h3 class="text-[0.55rem] text-gray-600 truncate">${emp.role}</h3>
            </div>

            <button class="delete-btn absolute top-[-5px] right-[-5px] bg-red-600 p-1 rounded-full text-white shadow-lg hover:bg-red-500 transition">
                <i class="fa-solid fa-xmark text-xs"></i>
            </button>
        </div>
    `;

    card.addEventListener('click', () => afichierInfoWorker(emp));

    card.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        updateEmployeeZone(emp.id, null);
    });

    // Insertion dans le conteneur approprié
    if (emp.zonesAsigned === "Réception") {
        containerReception.appendChild(card);
    }
    else if (emp.zonesAsigned === "Salle Serveurs") {
        containerServeurs.appendChild(card);
    }
    else if (emp.zonesAsigned === "Salle Sécurité") containerSecurite.appendChild(card);
    else if (emp.zonesAsigned === "Salle Personnel") containerPersonnel.appendChild(card);
    else if (emp.zonesAsigned === "Salle d'Archives") containerArchives.appendChild(card);
    else if (emp.zonesAsigned === "Salle de Conférence") containerConference.appendChild(card);
}


// --- Fonctions utilitaires ---
function updateEmployeeZone(id, newZone) {
    let employes = JSON.parse(localStorage.getItem('employe')) || [];
    for (let i = 0; i < employes.length; i++) {
        if (employes[i].id === id) {
            employes[i].zonesAsigned = newZone;
            break;
        }
    }
    localStorage.setItem('employe', JSON.stringify(employes));
    refreshUI();
}

// --- Configuration des boutons de zone (pour ouvrir le modal d'assignation) ---
function setupZoneButton(btn, rolesAllowed, zoneName) {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        let employes = JSON.parse(localStorage.getItem('employe')) || [];
        const workersInZone = employes.filter(emp => emp.zonesAsigned === zoneName).length;

        // **فحص الحد الأقصى**
        if (workersInZone >= MAX_WORKERS_PER_ZONE) {
            showTempAlert(`Cannot add more workers to ${zoneName}. Maximum limit of ${MAX_WORKERS_PER_ZONE} workers reached.`, 4000);
            return;
        }

        // فتح المودال إذا كان هناك مجال للإضافة
        modalContainer.style.display = 'flex';
        modalTitle.innerText = "Ajouter à : " + zoneName;
        employeesList.innerHTML = "";
        noRoleMessage.style.display = 'none';

        let found = false;

        employes.forEach(emp => {
            // Filtrer: بالدور المسموح به + غير مُعيّن لمنطقة أخرى
            if (rolesAllowed.includes(emp.role) && emp.zonesAsigned === null) {
                found = true;
                let div = document.createElement('div');
                div.className = "flex items-center gap-3 p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition rounded-lg";

div.innerHTML = `
    <img src="${emp.photo}" 
        class="w-10 h-10 rounded-full object-cover border border-gray-300"
        onerror="this.src='./public/images/default-Photo.jpg'">

    <div class="text-gray-900">
        <p class="font-semibold text-sm">${emp.fullname}</p>
        <p class="text-green-600 text-xs">${emp.role}</p>
    </div>
`;


                div.addEventListener('click', () => {
                    // **فحص الدور مرة أخرى قبل الإضافة النهائية**
                    if (!rolesAllowed.includes(emp.role)) {
                         showTempAlert(`Worker role (${emp.role}) is not allowed in ${zoneName}.`, 4000);
                         return;
                    }
                    updateEmployeeZone(emp.id, zoneName);
                    modalContainer.style.display = 'none';
                });
                employeesList.appendChild(div);
            }
        });

        if (!found) noRoleMessage.style.display = 'block';
    });
}

// Initialisation des boutons de zone
setupZoneButton(btnreception, roleInReceprion, "Réception");
setupZoneButton(btnserveurs, roleInServeurs, "Salle Serveurs");
setupZoneButton(btnsecurite, roleInSecurite, "Salle Sécurité");
setupZoneButton(btnpersonnel, roleInPersonnel, "Salle Personnel");
setupZoneButton(btnarchives, roleInArchives, "Salle d'Archives");
setupZoneButton(btnconference, roleInConference, "Salle de Conférence");


document.getElementById('formulaire').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    // 1. Déclaration des expressions régulières
    const nameRegEx = /^[a-zA-Z\s\u00C0-\u00FF'-]{2,}$/;
    const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegEx = /^\+?(\d[\d\s-]{8,}\d)$/;
    
    // 2. Récupération des éléments du formulaire
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    // 3. Fonction pour gérer l'affichage/masquage de l'erreur
    function displayError(inputElement, message, condition) {
        // Supprimer toute erreur précédente
        const previousError = inputElement.nextElementSibling;
        if (previousError && previousError.classList.contains('error-message')) {
            previousError.remove();
        }

        // Si la condition est fausse (donc, erreur)
        if (!condition) {
            // Créer le div d'erreur
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-red-500 text-xs mt-1';
            errorDiv.textContent = message;
            
            // Insérer l'erreur après le champ de saisie
            inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
            
            // Ajouter une classe d'erreur au champ pour le style (ex: bordure rouge)
            inputElement.classList.add('border-red-500');
            return false;
        } else {
            // Si la condition est vraie, retirer le style d'erreur
            inputElement.classList.remove('border-red-500');
            return true;
        }
    }

    // 4. Validation des champs
    const isNameValid = displayError(nameInput, '❌ Invalid Name. (Minimum 2 characters)', nameRegEx.test(nameInput.value));
    
    const isEmailValid = displayError(emailInput, '❌ Invalid Email format (e.g., user@domain.com)', emailRegEx.test(emailInput.value));
    
    const isPhoneValid = displayError(phoneInput, '❌ Invalid Phone number format.', phoneRegEx.test(phoneInput.value));
    
    // 5. Décision de la soumission finale
    if (isNameValid && isEmailValid && isPhoneValid) {
        // Si tout est valide, vous pouvez soumettre les données (par exemple, via fetch)
        alert('✅ Worker Added Successfully!');
        // Remplacer l'alert() par : document.getElementById('formulaire').submit();
    }
});
// --- Fonction d'affichage des informations détaillées d'un travailleur ---
function afichierInfoWorker(newwoker) {
    let divInfo = document.createElement('div');
divInfo.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4';

let modalContent = `
<div class="bg-white rounded-2xl w-full max-w-md p-6 relative text-gray-900 shadow-xl border border-gray-300">
    
    <!-- Bouton fermer -->
    <button id="close-info-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
        <i class="fa-solid fa-xmark text-2xl"></i>
    </button>
    
    <!-- Header utilisateur -->
    <div class="flex gap-4 items-center mb-6 border-b border-gray-200 pb-4">
        <img src="${newwoker.photo}" class="w-20 h-20 rounded-full border-4 border-blue-400 object-cover" onerror="this.src='./public/images/default-Photo.jpg'">
        <div>
            <h2 class="text-xl font-bold">${newwoker.fullname}</h2>
            <p class="text-blue-500 font-semibold">${newwoker.role}</p>
        </div>
    </div>

    <!-- Info contact -->
    <div id="contact-info" class="mb-4 bg-gray-100 p-3 rounded-lg">
        <p class="mb-1"><span class="text-gray-500 text-xs font-semibold">EMAIL:</span> ${newwoker.email}</p>
        <p><span class="text-gray-500 text-xs font-semibold">TEL:</span> ${newwoker.phone}</p>
    </div>

    <!-- Expériences -->
    <h3 class="border-b border-gray-200 mb-3 pb-1 font-bold text-lg">Expériences</h3>
    <ul id="exp-list" class="max-h-40 overflow-y-auto pr-2 no-scrollbar">
        <!-- Liens d'expérience injectés ici -->
    </ul>
</div>
`;


    divInfo.innerHTML = modalContent;

    let ul = divInfo.querySelector('#exp-list');
    let contactInfoDiv = divInfo.querySelector('#contact-info');
    let closeModalInfoBtn = divInfo.querySelector('#close-info-modal');


    if (newwoker.zonesAsigned) {
        let divZone = document.createElement('div');
        divZone.className = 'mb-4 bg-blue-50 p-3 rounded-lg border border-blue-300 shadow-sm';
divZone.innerHTML = `
    <p>
        <span class="text-blue-600 text-xs font-semibold">ZONE ASSIGNÉE:</span> 
        <span class="font-bold text-gray-900 text-lg block">${newwoker.zonesAsigned}</span>
    </p>
`;

        contactInfoDiv.after(divZone);
    }

    if (newwoker.experiences && newwoker.experiences.length > 0) {
        newwoker.experiences.forEach(e => {
            let li = document.createElement('li');
            li.className = "mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400 shadow-sm hover:bg-blue-50 transition";
li.innerHTML = `
    <div class="text-sm text-gray-500 mb-1">${e.dateFrom} <span class="mx-1"> To </span> ${e.dateTo}</div>
    <div class="font-semibold text-gray-900 uppercase">${e.entreprise}</div>
`;
ul.appendChild(li);

        });
    } else {
        ul.innerHTML = `<li class="text-gray-500 italic text-sm p-2">Aucune expérience enregistrée.</li>`;
    }

    divInfo.addEventListener('click', (e) => {
        if (e.target === divInfo) divInfo.remove();
    });
    closeModalInfoBtn.addEventListener('click', () => {
        divInfo.remove();
    });

    document.body.appendChild(divInfo);
}

// Appel initial pour charger les données au démarrage
refreshUI();