// In the init function, modify the admin controls check
function init() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUser = {
        username: payload.username,
        role: payload.role,
      };
      showAppPage();
      loadKeys();

      // Only show admin controls if user is admin
      if (currentUser.role === "admin") {
        document.getElementById("adminControls").style.display = "block";
        document.getElementById("userControls").style.display = "none";
      } else {
        document.getElementById("adminControls").style.display = "none";
        document.getElementById("userControls").style.display = "block";
      }
    } catch (e) {
      localStorage.removeItem("token");
      showLoginPage();
    }
  } else {
    showLoginPage();
  }

  document.getElementById("year").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const loginPage = document.getElementById("loginPage");
  const appPage = document.getElementById("appPage");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const currentUserSpan = document.getElementById("currentUser");
  const footerUserSpan = document.getElementById("footerUser");
  const adminControls = document.getElementById("adminControls");
  const showUsersBtn = document.getElementById("showUsersBtn");
  const usersSection = document.getElementById("usersSection");
  const usersTableBody = document.getElementById("usersTableBody");
  const addUserForm = document.getElementById("addUserForm");
  const passwordResetForm = document.getElementById("passwordResetForm");
  const keyForm = document.getElementById("keyForm");
  const keyTableBody = document.getElementById("keyTableBody");
  const keyCardsContainer = document.getElementById("keyCardsContainer");
  const searchInput = document.getElementById("searchInput");

  // Global state
  let currentUser = null;
  let allKeys = [];

  // Initialize the app
  init();

  // Common event listeners for all users
  loginForm.addEventListener("submit", handleLogin);
  logoutBtn.addEventListener("click", handleLogout);
  keyForm.addEventListener("submit", handleAddKey);
  searchInput.addEventListener("input", handleSearch);

  // Only add admin-related event listeners if user is admin
  if (currentUser && currentUser.role === "admin") {
    showUsersBtn.addEventListener("click", toggleUsersSection);
    addUserForm.addEventListener("submit", handleAddUser);
    passwordResetForm.addEventListener("submit", handlePasswordReset);
  }

  function init() {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        currentUser = {
          username: payload.username,
          role: payload.role,
        };
        showAppPage();
        loadKeys();
        if (currentUser.role === "admin") {
          adminControls.style.display = "block";
        }
      } catch (e) {
        localStorage.removeItem("token");
        showLoginPage();
      }
    } else {
      showLoginPage();
    }

    // Set current year in footer
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  function showLoginPage() {
    loginPage.style.display = "flex";
    appPage.style.display = "none";
  }

  function showAppPage() {
    loginPage.style.display = "none";
    appPage.style.display = "block";

    currentUserSpan.textContent = currentUser.username;
    footerUserSpan.textContent = currentUser.username;
  }

  // Event Listeners
  loginForm.addEventListener("submit", handleLogin);
  logoutBtn.addEventListener("click", handleLogout);
  showUsersBtn.addEventListener("click", toggleUsersSection);
  addUserForm.addEventListener("submit", handleAddUser);
  passwordResetForm.addEventListener("submit", handlePasswordReset);
  keyForm.addEventListener("submit", handleAddKey);
  searchInput.addEventListener("input", handleSearch);

  // In the handleLogin function, update the role-based UI
  async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      currentUser = {
        username: data.username,
        role: data.role,
      };

      showAppPage();
      loadKeys();

      // Update UI based on role
      if (currentUser.role === "admin") {
        document.getElementById("adminControls").style.display = "block";
        document.getElementById("userManagementSection").style.display = "none";
        document.getElementById("passwordResetSection").style.display = "none";
        document.getElementById("showUsersBtn").style.display = "block";
        document.getElementById("userControls").style.display = "none";
      } else {
        document.getElementById("adminControls").style.display = "none";
        document.getElementById("userManagementSection").style.display = "none";
        document.getElementById("passwordResetSection").style.display = "none";
        document.getElementById("showUsersBtn").style.display = "none";
        document.getElementById("userControls").style.display = "block";
      }
    } catch (error) {
      document.getElementById("loginError").textContent = error.message;
    }
  }

  // In the init function, modify to properly show/hide elements
  function init() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        currentUser = {
          username: payload.username,
          role: payload.role,
        };
        showAppPage();
        loadKeys();

        // Set up UI based on role
        if (currentUser.role === "admin") {
          document.getElementById("adminControls").style.display = "block";
          document.getElementById("keyFormContainer").style.display = "block"; // Show form for admin
          document.getElementById("userControls").style.display = "none";
        } else {
          document.getElementById("adminControls").style.display = "none";
          document.getElementById("keyFormContainer").style.display = "block"; // Show form for regular users
          document.getElementById("userControls").style.display = "block";
        }
      } catch (e) {
        localStorage.removeItem("token");
        showLoginPage();
      }
    } else {
      showLoginPage();
    }
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  // In the handleLogin function, ensure form visibility is set correctly
  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: document.getElementById("username").value,
          password: document.getElementById("password").value,
        }),
      });

      if (!response.ok)
        throw new Error(await response.json().then((data) => data.error));

      const data = await response.json();
      localStorage.setItem("token", data.token);
      currentUser = { username: data.username, role: data.role };

      showAppPage();
      loadKeys();

      // Set form visibility based on role
      document.getElementById("keyFormContainer").style.display = "block";
      if (currentUser.role === "admin") {
        document.getElementById("adminControls").style.display = "block";
        document.getElementById("userControls").style.display = "none";
      } else {
        document.getElementById("adminControls").style.display = "none";
        document.getElementById("userControls").style.display = "block";
      }
    } catch (error) {
      document.getElementById("loginError").textContent = error.message;
    }
  }

  // Modify the handleAddKey function to allow all authenticated users to add keys
  async function handleAddKey(e) {
    e.preventDefault();

    // Only check if user is authenticated, not their role
    if (!currentUser) {
      alert("Please login to add key assignments");
      return;
    }

    const formData = {
      event: document.getElementById("event").value,
      room: document.getElementById("room").value,
      device: document.getElementById("device").value,
      vMixKey: document.getElementById("vMixKey").value,
      user: document.getElementById("user").value,
      status: document.getElementById("status").value,
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value,
    };

    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add key");

      const newKey = await response.json();
      allKeys.push(newKey);
      renderKeys(allKeys);
      keyForm.reset();
    } catch (error) {
      alert(error.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    currentUser = null;
    showLoginPage();
  }

  function toggleUsersSection() {
    if (currentUser.role !== "admin") return;

    usersSection.style.display =
      usersSection.style.display === "none" ? "block" : "none";
    if (usersSection.style.display === "block") {
      loadUsers();
    }
  }

  async function loadUsers() {
    try {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load users");

      const users = await response.json();
      renderUsers(users);
    } catch (error) {
      alert(error.message);
    }
  }

  function renderUsers(users) {
    usersTableBody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            `;

      usersTableBody.appendChild(row);
    });
  }

  async function handleAddUser(e) {
    e.preventDefault();

    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;
    const role = document.getElementById("newUserRole").value;

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add user");
      }

      const newUser = await response.json();
      loadUsers();
      addUserForm.reset();
      alert(`User ${newUser.username} added successfully`);
    } catch (error) {
      alert(error.message);
    }
  }

  async function handlePasswordReset(e) {
    e.preventDefault();

    const username = document.getElementById("resetUsername").value;
    const newPassword = document.getElementById("newPassword").value;

    try {
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, newPassword }),
      });

      if (!response.ok) throw new Error("Failed to reset password");

      passwordResetForm.reset();
      alert(`Password for ${username} has been reset`);
    } catch (error) {
      alert(error.message);
    }
  }

  async function loadKeys() {
    try {
      const response = await fetch("/api/keys", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load keys");

      allKeys = await response.json();
      renderKeys(allKeys);
    } catch (error) {
      alert(error.message);
    }
  }

  // In the renderKeys function, modify the table and card views
  function renderKeys(keys) {
    // Filter keys for regular users to only show current assignments
    const now = new Date();
    const filteredKeys =
      currentUser.role === "admin"
        ? keys
        : keys.filter((key) => {
            const startDate = new Date(key.startDate);
            const endDate = new Date(key.endDate);
            return startDate <= now && endDate >= now;
          });

    keyTableBody.innerHTML = "";
    keyCardsContainer.innerHTML = "";

    if (filteredKeys.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML =
        '<td colspan="9" class="empty-message">No key assignments found</td>';
      keyTableBody.appendChild(emptyRow);
      return;
    }

    // Desktop table view
    filteredKeys.forEach((key) => {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td>${key.event}</td>
      <td>${key.room}</td>
      <td>${key.device}</td>
      <td class="key-cell">${key.vMixKey}</td>
      <td>${key.user}</td>
      <td>${new Date(key.startDate).toLocaleDateString()}</td>
      <td>${new Date(key.endDate).toLocaleDateString()}</td>
      <td><span class="status-badge ${key.status}">${key.status}</span></td>
      <td class="actions">
          ${
            currentUser.role === "admin"
              ? `
            <button class="btn-edit" data-id="${key.id}">Edit</button>
            <button class="btn-delete" data-id="${key.id}">Delete</button>
            `
              : '<span class="view-only">View only</span>'
          }
      </td>
    `;

      keyTableBody.appendChild(row);
    });

    // Mobile card view
    if (window.innerWidth <= 768) {
      filteredKeys.forEach((key) => {
        const card = document.createElement("div");
        card.className = "key-card";

        card.innerHTML = `
        <div class="card-header">
          <h3>${key.event}</h3>
          <span class="status-badge ${key.status}">${key.status}</span>
        </div>
        <div class="card-body">
          <p><strong>Room:</strong> ${key.room}</p>
          <p><strong>Device:</strong> ${key.device}</p>
          <p><strong>vMix Key:</strong> <span class="key-cell">${
            key.vMixKey
          }</span></p>
          <p><strong>User:</strong> ${key.user}</p>
          <p><strong>Dates:</strong> ${new Date(
            key.startDate
          ).toLocaleDateString()} - ${new Date(
          key.endDate
        ).toLocaleDateString()}</p>
        </div>
        ${
          currentUser.role === "admin"
            ? `
          <div class="card-actions">
            <button class="btn-edit" data-id="${key.id}">Edit</button>
            <button class="btn-delete" data-id="${key.id}">Delete</button>
          </div>
          `
            : ""
        }
      `;

        keyCardsContainer.appendChild(card);
      });
    }

    // Only add event listeners if admin
    if (currentUser.role === "admin") {
      document.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", () => editKey(btn.dataset.id));
      });

      document.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", () => deleteKey(btn.dataset.id));
      });
    }
  }

  async function handleAddKey(e) {
    e.preventDefault();

    const formData = {
      event: document.getElementById("event").value,
      room: document.getElementById("room").value,
      device: document.getElementById("device").value,
      vMixKey: document.getElementById("vMixKey").value,
      user: document.getElementById("user").value,
      status: document.getElementById("status").value,
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value,
    };

    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add key");

      const newKey = await response.json();
      allKeys.push(newKey);
      renderKeys(allKeys);
      keyForm.reset();
    } catch (error) {
      alert(error.message);
    }
  }

  async function editKey(keyId) {
    const key = allKeys.find((k) => k.id === keyId);
    if (!key) return;

    // Fill the form with the key data
    document.getElementById("event").value = key.event;
    document.getElementById("room").value = key.room;
    document.getElementById("device").value = key.device;
    document.getElementById("vMixKey").value = key.vMixKey;
    document.getElementById("user").value = key.user;
    document.getElementById("status").value = key.status;
    document.getElementById("startDate").value = key.startDate.split("T")[0];
    document.getElementById("endDate").value = key.endDate.split("T")[0];

    // Change form to update mode
    keyForm.onsubmit = async function (e) {
      e.preventDefault();

      const formData = {
        event: document.getElementById("event").value,
        room: document.getElementById("room").value,
        device: document.getElementById("device").value,
        vMixKey: document.getElementById("vMixKey").value,
        user: document.getElementById("user").value,
        status: document.getElementById("status").value,
        startDate: document.getElementById("startDate").value,
        endDate: document.getElementById("endDate").value,
      };

      try {
        const response = await fetch(`/api/keys/${keyId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update key");

        const updatedKey = await response.json();
        const keyIndex = allKeys.findIndex((k) => k.id === keyId);
        allKeys[keyIndex] = updatedKey;
        renderKeys(allKeys);
        keyForm.reset();
        keyForm.onsubmit = handleAddKey; // Reset form to add mode
      } catch (error) {
        alert(error.message);
      }
    };

    // Change button text
    document.querySelector('#keyForm button[type="submit"]').textContent =
      "Update Key Assignment";

    // Scroll to form
    document.getElementById("keyForm").scrollIntoView({ behavior: "smooth" });
  }

  async function deleteKey(keyId) {
    if (!confirm("Are you sure you want to delete this key assignment?"))
      return;

    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete key");

      allKeys = allKeys.filter((k) => k.id !== keyId);
      renderKeys(allKeys);
    } catch (error) {
      alert(error.message);
    }
  }

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    if (!searchTerm) {
      renderKeys(allKeys);
      return;
    }

    const filteredKeys = allKeys.filter(
      (key) =>
        key.event.toLowerCase().includes(searchTerm) ||
        key.room.toLowerCase().includes(searchTerm) ||
        key.device.toLowerCase().includes(searchTerm) ||
        key.user.toLowerCase().includes(searchTerm) ||
        key.vMixKey.toLowerCase().includes(searchTerm) ||
        key.status.toLowerCase().includes(searchTerm)
    );

    renderKeys(filteredKeys);
  }

  // Responsive table/card view toggle
  window.addEventListener("resize", () => {
    renderKeys(allKeys);
  });
});
