#  WorkSphere - Gestion Visuelle et Interactive du Personnel

##  Aperçu du Projet

Bienvenue sur **WorkSphere**, l'application web innovante conçue pour transformer la gestion du personnel au sein de nos espaces de travail. Notre objectif principal est de fournir une interface **visuelle, interactive et temps réel** permettant d'organiser et de répartir les employés sur un plan d'étage, tout en garantissant le respect des rôles et des contraintes d'accès aux zones. Fini les tableaux statiques, place à une gestion d'équipe fluide et intuitive !

##  Objectifs Clés

* **Visualisation Spatiale :** Gérer le placement des employés directement sur la représentation graphique des locaux.
* **Respect des Règles Métier :** Assurer que chaque employé n'est affecté qu'à des zones autorisées par son rôle (ex : Réceptionniste → Réception uniquement).
* **Expérience Utilisateur (UX) Optimale :** Offrir une application **fluide, intuitive, responsive** (Desktop, Tablette, Mobile) avec un design moderne.
* **Centralisation :** Unifier la gestion des données du personnel et leur localisation spatiale sur une seule plateforme.

---

##  Fonctionnalités Principales

### 1. Gestion Interactive du Personnel

* **Ajout/Modification/Suppression :** Ajouter de nouveaux employés via une **modale complète**, les déplacer sur le plan, ou les retirer de leur poste (bouton "X") pour les replacer dans la liste "Unassigned Staff".
* **Modale d'Ajout d'Employé :** Formulaire incluant **Nom, Rôle, Photo (URL), Email, Téléphone** et un champ dynamique pour les **Expériences Professionnelles**.
    * *Validation Avancée :* Le formulaire est validé par **REGEX** et vérifie la logique des dates d'expérience (date de début < date de fin).
    * *Prévisualisation :* Affichage immédiat de la photo (URL) renseignée.
* **Affectation :** Utilisation d'un bouton **"+"** dans chaque zone pour sélectionner un employé éligible parmi la liste des non-assignés.

### 2. Plan d'Étage et Zones

L'application affiche le plan d'étage du bâtiment, divisé en 6 zones distinctes :
1.  Salle de conférence
2.  Réception
3.  Salle des serveurs
4.  Salle de sécurité
5.  Salle du personnel
6.  Salle d’archives

### 3. Logique de Restrictions d'Accès

Des règles métier strictes régissent l'affectation des employés aux zones :

| Zone | Rôles Autorisés |
| :--- | :--- |
| **Réception** | **Réceptionnistes** uniquement |
| **Salle des serveurs** | **Techniciens IT** uniquement |
| **Salle de sécurité** | **Agents de sécurité** uniquement |
| **Manager** | Accès à **toutes** les zones |
| **Nettoyage** | Accès libre **sauf** à la Salle d’archives |
| **Autres Rôles** | Accès libre **sauf** aux zones restreintes ci-dessus |
| **Général** | Les zones comme **Salle de conférence** et **Salle du personnel** sont accessibles à tous (non obligatoires). |

* *Indicateur Visuel :* Les zones obligatoires vides (Réception, Serveurs, Sécurité, Archives) apparaissent en **rouge pâle** pour signaler un besoin d'affectation.
* *Limitation de Capacité :* Chaque zone intègre une **limitation du nombre d'employés** qu'elle peut accueillir.

### 4. Profil Détaillé

Un simple clic sur un employé (sur le plan ou dans la liste) ouvre une **fenêtre détaillée** affichant :
* Photo grand format
* Nom, Rôle, Email, Téléphone
* Liste des expériences professionnelles
* Localisation actuelle (si assigné)

---

##  Stack Technique (Front-End)

| Composant | Technologie/Méthode | Notes |
| :--- | :--- | :--- |
| **Structure** | HTML5 (validation **W3C**) | Sémantique et accessible. |
| **Mise en page** | CSS3 (validation **W3C**) | Utilisation de **Flexbox** et **Grid** pour une structure robuste. |
| **Design/UX** | Design **moderne** et **responsive** (formes arrondies, boutons colorés : vert, orange, rouge). | Palette de couleurs cohérente et icônes intuitives. |
| **Responsivité** | Media Queries avancées | Gestion complète des 4 tailles d'écrans Portrait et 2 tailles Paysage. |
| **Interaction** | JavaScript | Logique métier (règles de placement, validation de formulaire) et animations fluides. |
| **Déploiement** | **GitHub Pages** ou **Vercel** | Mise en ligne facile pour la démonstration. |

###  Gestion des Tailles d'Écrans (Responsive Design)

| Orientation | Plage de Largeur | Type d'Écran |
| :--- | :--- | :--- |
| **Portrait** | Jusqu'à 767px | Mobile |
| **Portrait** | 768px - 1023px | Tablette |
| **Portrait** | 1024px - 1279px | Petit écran d'ordinateur |
| **Portrait** | 1280px et plus | Grand écran d'ordinateur |
| **Paysage** | 768px - 1023px | Mobile (large) |
| **Paysage** | 1024px - 1279px | Tablette (large) |

---

##  Organisation du Projet (Scrum Master)

En tant que Scrum Master, les tâches sont organisées pour assurer une progression claire et un suivi efficace :

* **Outil de Gestion :** Utilisation de **Trello, Jira ou GitHub Projects** pour la gestion des User Stories, le suivi de l'avancement, et l'attribution des tâches.
* **Structure de Développement :** (Optionnel) Gestion structurée des branches Git (`main`, `develop`, `feature/*`) pour une intégration et un déploiement continus.
* **Livraison :** Le projet final sera présenté sous forme de **démonstration** exhaustive de toutes les fonctionnalités dynamiques, validant chaque User Story.

---

##  Pour Démarrer le Projet

1.  **Cloner le dépôt :**
    ```bash
    git clone [https://www.linguee.com/french-english/translation/d%C3%A9p%C3%B4t.html](https://www.linguee.com/french-english/translation/d%C3%A9p%C3%B4t.html)
    cd worksphere
    ```
2.  **Ouvrir l'application :**
    Ouvrez le fichier `index.html` dans votre navigateur web, ou accédez à l'URL de déploiement (GitHub Pages/Vercel).

**Nous sommes prêts à organiser et optimiser l'espace de travail WorkSphere !**