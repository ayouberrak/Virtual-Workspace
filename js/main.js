// variables globale
let btnAdd = document.getElementById('btn-add'); // Bouton pour ouvrir le formulaire d'ajout
let formulaire = document.getElementById('model-form'); // Le formulaire modal d'ajout d'employe
let cancelBtn = document.getElementById('cancel-btn'); // Bouton d'annulation dans le formulaire
let photoInput = document.getElementById('Photo'); // Champ de saisie pour l'URL de la photo
let photoPreview = document.getElementById('photoPreview'); // Conteneur pour l'apercu de la photo
let btnAddExperiences = document.getElementById('btn-Add-Experiences'); // Bouton pour ajouter une experience pro
let experiencesContainer = document.getElementById('experiances-contairer'); // Conteneur des experiences pro
let form = document.getElementById('formulaire'); // Le formulaire principal
let workersContainer = document.getElementById('workers-container'); // Conteneur des employes non assignes (dans la barre laterale)

const modalContainer = document.getElementById('modal-container'); // Le conteneur modal pour l'assignation de zone
const modalTitle = document.getElementById('modal-title'); // Titre du modal d'assignation
const employeesList = document.getElementById('authorized-employees-list'); // Liste des employes a assigner dans le modal
const noRoleMessage = document.getElementById('no-role-message'); // Message si aucun employe ne correspond au role
const closeModalBtn = document.getElementById('close-modal-btn'); // Bouton pour fermer le modal d'assignation

// Conteneurs de zone pour l'affichage des employes assignes
const containerReception = document.getElementById('container-reception');
const containerServeurs = document.getElementById('container-serveurs');
const containerSecurite = document.getElementById('container-securite');
const containerPersonnel = document.getElementById('container-personnel');
const containerArchives = document.getElementById('container-archives');
const containerConference = document.getElementById('container-conference');

// Boutons pour ouvrir le modal d'assignation pour chaque zone
const btnreception = document.getElementById('btn-reception');
const btnserveurs = document.getElementById('btn-salle-serveurs');
const btnsecurite = document.getElementById('btn-salle-securite');
const btnpersonnel = document.getElementById('btn-salle-personnel');
const btnarchives = document.getElementById('btn-salle-darchives');
const btnconference = document.getElementById('btn-salle-conference');

const searchInput = document.getElementById('search-worker'); // Champ de recherche d'employe
const filterSelect = document.getElementById('filter-role'); // Selecteur de filtre par role

const tempAlert = document.getElementById('temp-alert'); // Element pour les notifications temporaires

const MAX_WORKERS_PER_ZONE = 5; // Nombre maximum d'employes par zone

// Listes des roles autorises par zone (sans accents ni majuscules pour les chaines UI)
let roleInReceprion = ["Receptionnistes", "Manager", "Nettoyage"];
let roleInServeurs = ["Techniciens IT", "Manager", "Nettoyage"];
let roleInSecurite = ["Agents de securite", "Manager", "Nettoyage"];
let roleInPersonnel = ["Agents de securite", "Manager", "Nettoyage", "Autres roles", "Techniciens IT", "Receptionnistes"];
let roleInArchives = ["Manager"];
let roleInConference = ["Agents de securite", "Manager", "Nettoyage", "Autres roles", "Techniciens IT", "Receptionnistes"];

/**
 * Affiche un message d'alerte temporaire a l'utilisateur.
 * @param {string} message - Le message a afficher.
 * @param {number} [duration=3000] - La duree d'affichage en millisecondes.
 */
function showTempAlert(message, duration = 3000) {
    if (tempAlert.timeout) {
        clearTimeout(tempAlert.timeout);
    }

    tempAlert.innerText = message;
    tempAlert.classList.remove('hidden');
    tempAlert.style.opacity = '1';

    tempAlert.timeout = setTimeout(() => {
        tempAlert.style.opacity = '0';
        setTimeout(() => {
            tempAlert.classList.add('hidden');
        }, 300); // Delai pour la transition d'opacite
    }, duration);
}

// Gestionnaires d'evenements pour l'affichage/masquage du formulaire d'ajout
btnAdd.addEventListener('click', () => {
    formulaire.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    formulaire.classList.add('hidden');
});

// Gestionnaire d'evenement pour fermer le modal d'assignation
closeModalBtn.addEventListener('click', () => {
    modalContainer.style.display = 'none';
});

// Apercu de la photo a partir de l'URL
photoInput.addEventListener('input', (e) => {
    photoPreview.innerHTML = '';
    let img = document.createElement('img');
    img.className = 'w-full h-full object-cover';
    // Gestion d'erreur pour l'image
    img.onerror = () => {
        img.src = './public/images/default-Photo.jpg';
    };
    img.src = e.target.value;
    photoPreview.appendChild(img);
});

// Gestionnaires d'evenements pour la recherche et le filtre
if (searchInput && filterSelect) {
    searchInput.addEventListener('input', () => refreshUI());
    filterSelect.addEventListener('change', () => refreshUI());
}

/**
 * Affiche ou supprime un message d'erreur de validation pour un champ de formulaire.
 * @param {HTMLElement} inputElement - L'element d'entree du formulaire.
 * @param {string} message - Le message d'erreur a afficher.
 * @param {boolean} condition - La condition de validation (true si valide).
 * @returns {boolean} - L'etat de la validation.
 */
function displayError(inputElement, message, condition) {
    const previousError = inputElement.nextElementSibling;
    // Supprime l'erreur precedente si elle existe
    if (previousError && previousError.classList.contains('error-message')) {
        previousError.remove();
    }

    if (!condition) {
        // Affiche la nouvelle erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-xs mt-1';
        errorDiv.textContent = message;

        inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);

        inputElement.classList.add('border-red-500');
        return false;
    } else {
        // Supprime la bordure d'erreur
        inputElement.classList.remove('border-red-500');
        return true;
    }
}

// Soumission du formulaire d'ajout d'employe et validation
form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Expressions regulieres de validation
    const nameRegEx = /^[a-zA-Z\s\u00C0-\u00FF'-]{2,}$/;
    const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegEx = /^\+?(\d[\d\s-]{8,}\d)$/;
    const entrepriseRegEx = /^[a-zA-Z0-9\s.,'-]{2,}$/;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    // Validation des champs principaux
    const isNameValid = displayError(nameInput, ' Nom invalide. (Minimum 2 caracteres)', nameRegEx.test(nameInput.value));
    const isEmailValid = displayError(emailInput, ' Format d\'email invalide (ex: utilisateur@domaine.com)', emailRegEx.test(emailInput.value));
    const isPhoneValid = displayError(phoneInput, ' Numero de telephone invalide.', phoneRegEx.test(phoneInput.value));

    let isExperienceValid = true;
    let experiences = [];

    // Validation des champs d'experience et collecte des donnees
    document.querySelectorAll('#experiances-contairer > div').forEach(div => {
        let entInput = div.querySelector('input[name="Entreprise"]');
        let dFrom = div.querySelector('input[name="DateFrom"]').value;
        let dTo = div.querySelector('input[name="DateTo"]').value;
        let ent = entInput.value;

        if (ent && !entrepriseRegEx.test(ent)) {
            displayError(entInput, ' Nom de l\'entreprise invalide.', entrepriseRegEx.test(ent));
            isExperienceValid = false;
        } else if (ent) {
            displayError(entInput, '', true); // Supprimer l'erreur si valide
        }

        if (ent && dFrom && dTo) {
            experiences.push({ entreprise: ent, dateFrom: dFrom, dateTo: dTo });
        }
    });

    // Arrete la soumission si une validation echoue
    if (!(isNameValid && isEmailValid && isPhoneValid && isExperienceValid)) {
        return;
    }

    // Collecte des donnees du nouvel employe
    let name = nameInput.value;
    let position = document.getElementById('role').value;
    let image = document.getElementById('Photo').value;
    if (!image) image = './public/images/default-Photo.jpg';

    let email = emailInput.value;
    let phone = phoneInput.value;

    let worker = {
        id: Date.now(),
        fullname: name,
        role: position,
        photo: image,
        email: email,
        phone: phone,
        experiences: experiences,
        zonesAsigned: null // Initialisation sans zone
    };

    // Sauvegarde dans localStorage
    let employes = JSON.parse(localStorage.getItem('employe')) || [];
    employes.push(worker);
    localStorage.setItem('employe', JSON.stringify(employes));

    // Reinitialisation du formulaire et fermeture du modal
    form.reset();
    photoPreview.innerHTML = `<img src="./public/images/default-Photo.jpg" alt="default-Photo" class="w-full h-full object-cover">`;
    experiencesContainer.innerHTML = ''; // Nettoyer les champs d'experience

    formulaire.classList.add('hidden');
    showTempAlert('Employe Ajoute avec Succes!');
    refreshUI(); // Mise a jour de l'interface utilisateur
});

// Ajout dynamique d'un champ d'experience professionnelle
btnAddExperiences.addEventListener('click', () => {
    let div = document.createElement('div');
    div.className = 'mt-4 p-2 rounded-lg bg-gray-50';
    // Le contenu du champ d'experience avec un bouton de suppression
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
    // Ajout du gestionnaire d'evenement pour la suppression de l'experience
    div.querySelector('.delete-exp').addEventListener('click', () => div.remove());
    experiencesContainer.appendChild(div);
});

/**
 * Met a jour l'interface utilisateur en affichant les employes non assignes et assignes.
 * Gere egalement la recherche et le filtrage.
 */
function refreshUI() {
    // Nettoyage de tous les conteneurs
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
        // Logique de recherche et de filtrage
        const matchesSearch = emp.fullname.toLowerCase().includes(searchTerm) || emp.role.toLowerCase().includes(searchTerm);
        const matchesRole = filterRole === 'all' || emp.role === filterRole;

        if (emp.zonesAsigned === null) {
            // Employe non assigne : affiche dans la barre laterale s'il correspond aux criteres
            if (matchesSearch && matchesRole) {
                createSidebarCard(emp);
            }
        } else {
            // Employe assigne : affiche dans la zone correspondante
            createZoneCard(emp);
        }
    });
}

/**
 * Cree et affiche la carte d'un employe dans la barre laterale (non assigne).
 * @param {object} emp - L'objet employe.
 */
function createSidebarCard(emp) {
    let card = document.createElement('div');
    card.className = "cursor-pointer p-2 bg-gray-100 rounded-lg text-gray-800 flex items-center gap-4 transition-all cursor-pointer hover:bg-gray-200";

    card.innerHTML = `
        <img src="${emp.photo}" class="w-10 h-10 rounded-full object-cover" onerror="this.src='./public/images/default-Photo.jpg'">
        <div>
            <p class="font-bold text-sm">${emp.fullname}</p>
            <p class="text-gray-500 text-xs">${emp.role}</p>
        </div>
    `;
    card.addEventListener('click', () => afichierInfoWorker(emp)); // Affiche les details au clic
    workersContainer.appendChild(card);
}

/**
 * Cree et affiche la carte d'un employe dans un conteneur de zone (assigne).
 * @param {object} emp - L'objet employe.
 */
function createZoneCard(emp) {
    let card = document.createElement('div');
    card.className = "relative cursor-pointer max-w-[8rem] hover:scale-[1.02] transition";

    card.innerHTML = `
        <div class="relative flex items-center gap-2 p-1 bg-white/90 rounded-lg shadow-md ">
            <img src="${emp.photo}"
                class="h-8 w-8 rounded-full object-cover "
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

    // Gestionnaire pour desassigner l'employe (bouton "x")
    card.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation(); // Empeche le declenchement de l'affichage des infos
        updateEmployeeZone(emp.id, null);
        showTempAlert(`Employe ${emp.fullname} a ete desassigne.`);
    });

    // Ajout de la carte au conteneur de zone approprie (logique de routage des cartes)
    if (emp.zonesAsigned === "Reception") {
        containerReception.appendChild(card);
    }
    else if (emp.zonesAsigned === "Salle Serveurs") {
        containerServeurs.appendChild(card);
    }
    else if (emp.zonesAsigned === "Salle Securite") containerSecurite.appendChild(card);
    else if (emp.zonesAsigned === "Salle Personnel") containerPersonnel.appendChild(card);
    else if (emp.zonesAsigned === "Salle d'Archives") containerArchives.appendChild(card);
    else if (emp.zonesAsigned === "Salle de Conference") containerConference.appendChild(card);
}

/**
 * Met a jour la zone d'un employe dans le localStorage et rafraichit l'UI.
 * @param {number} id - L'ID de l'employe.
 * @param {string|null} newZone - Le nom de la nouvelle zone ou `null` pour desassigner.
 */
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

/**
 * Configure le gestionnaire d'evenement pour un bouton de zone.
 * Ouvre le modal et affiche les employes disponibles pour cette zone.
 * @param {HTMLElement} btn - Le bouton de zone.
 * @param {string[]} rolesAllowed - Les roles autorises dans cette zone.
 * @param {string} zoneName - Le nom de la zone (utilise pour l'assignation).
 */
function setupZoneButton(btn, rolesAllowed, zoneName) {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        let employes = JSON.parse(localStorage.getItem('employe')) || [];
        // Verifie la limite de travailleurs dans la zone
        const workersInZone = employes.filter(emp => emp.zonesAsigned === zoneName).length;

        if (workersInZone >= MAX_WORKERS_PER_ZONE) {
            showTempAlert(`Impossible d'ajouter plus d'employes a ${zoneName}. Limite maximale de ${MAX_WORKERS_PER_ZONE} employes atteinte.`, 4000);
            return;
        }

        modalContainer.style.display = 'flex';
        modalTitle.innerText = "Ajouter a : " + zoneName; // Mise a jour du titre
        employeesList.innerHTML = "";
        noRoleMessage.style.display = 'none';

        let found = false;

        // Affichage des employes non assignes avec un role autorise
        employes.forEach(emp => {
            // Condition pour l'affichage dans le modal d'assignation
            if (rolesAllowed.includes(emp.role) && emp.zonesAsigned === null) {
                found = true;
                let div = document.createElement('div');
                div.className = "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition rounded-lg";

                div.innerHTML = `
                    <img src="${emp.photo}"
                        class="w-10 h-10 rounded-full object-cover "
                        onerror="this.src='./public/images/default-Photo.jpg'">

                    <div class="text-gray-900">
                        <p class="font-semibold text-sm">${emp.fullname}</p>
                        <p class="text-blue-600 text-xs">${emp.role}</p>
                    </div>
                `;
                // Gestionnaire d'evenement pour l'assignation au clic
                div.addEventListener('click', () => {
                    // Double verification de la limite avant l'assignation
                    const workersInZoneAfterCheck = employes.filter(emp => emp.zonesAsigned === zoneName).length;
                    if (workersInZoneAfterCheck >= MAX_WORKERS_PER_ZONE) {
                        showTempAlert(`Impossible d'ajouter plus d'employes a ${zoneName}. Limite maximale atteinte.`, 4000);
                        modalContainer.style.display = 'none';
                        return;
                    }

                    updateEmployeeZone(emp.id, zoneName);
                    showTempAlert(`Employe ${emp.fullname} assigne a ${zoneName}.`, 3000);
                    modalContainer.style.display = 'none'; // Ferme le modal apres assignation
                });
                employeesList.appendChild(div);
            }
        });

        if (!found) noRoleMessage.style.display = 'block'; // Affiche le message s'il n'y a pas d'employe disponible
    });
}

// Initialisation des boutons de zone
setupZoneButton(btnreception, roleInReceprion, "Reception");
setupZoneButton(btnserveurs, roleInServeurs, "Salle Serveurs");
setupZoneButton(btnsecurite, roleInSecurite, "Salle Securite");
setupZoneButton(btnpersonnel, roleInPersonnel, "Salle Personnel");
setupZoneButton(btnarchives, roleInArchives, "Salle d'Archives");
setupZoneButton(btnconference, roleInConference, "Salle de Conference");

/**
 * Affiche un modal avec les informations detaillees de l'employe.
 * @param {object} newwoker - L'objet employe.
 */
function afichierInfoWorker(newwoker) {
    let divInfo = document.createElement('div');
    // Classe pour le modal d'information (couverture complete de l'ecran)
    divInfo.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4';

    // Generation de la liste des experiences professionnelles
    let expListItems = newwoker.experiences && newwoker.experiences.length > 0
        ? newwoker.experiences.map(e => `
            <li class="mb-3 p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-blue-50 transition">
                <div class="text-sm text-gray-500 mb-1">${e.dateFrom} <span class="mx-1"> A </span> ${e.dateTo}</div>
                <div class="font-semibold text-gray-900 uppercase">${e.entreprise}</div>
            </li>
          `).join('')
        : `<li class="text-gray-500 italic text-sm p-2">Aucune experience enregistree.</li>`;

    // Information sur la zone assignee
    let zoneInfo = newwoker.zonesAsigned ? `
        <div class="mb-4 p-3 rounded-lg shadow-sm">
            <p>
                <span class="text-blue-600 text-xs font-semibold">ZONE ASSIGNEE:</span>
                <span class="font-bold text-gray-900 text-lg block">${newwoker.zonesAsigned}</span>
            </p>
        </div>
    ` : '';

    // Contenu HTML du modal
    let modalContent = `
        <div class="bg-white rounded-2xl w-full max-w-md p-6 relative text-gray-900 shadow-xl border border-gray-300">

            <button id="close-info-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
                <i class="fa-solid fa-xmark text-2xl"></i>
            </button>

            <div class="flex gap-4 items-center mb-6 ">
                <img src="${newwoker.photo}" class="w-20 h-20 rounded-full object-cover" onerror="this.src='./public/images/default-Photo.jpg'">
                <div>
                    <h2 class="text-xl font-bold">${newwoker.fullname}</h2>
                    <p class="text-blue-500 font-semibold">${newwoker.role}</p>
                </div>
            </div>

            ${zoneInfo}

            <div id="contact-info" class="mb-4 p-3 rounded-lg">
                <p class="mb-1"><span class="text-gray-500 text-xs font-semibold">EMAIL:</span> ${newwoker.email}</p>
                <p><span class="text-gray-500 text-xs font-semibold">TEL:</span> ${newwoker.phone}</p>
            </div>

            <h3 class="mb-3 pb-1 font-bold text-lg">Experiences</h3>
            <ul id="exp-list" class="max-h-40 overflow-y-auto pr-2 no-scrollbar">
                ${expListItems}
            </ul>
        </div>
    `;

    divInfo.innerHTML = modalContent;

    let closeModalInfoBtn = divInfo.querySelector('#close-info-modal');

    // Fermeture du modal en cliquant a l'exterieur
    divInfo.addEventListener('click', (e) => {
        if (e.target === divInfo) divInfo.remove();
    });
    // Fermeture du modal via le bouton "x"
    closeModalInfoBtn.addEventListener('click', () => {
        divInfo.remove();
    });

    document.body.appendChild(divInfo); // Ajout du modal au corps du document
}

// Appel initial pour charger les employes au demarrage
refreshUI();