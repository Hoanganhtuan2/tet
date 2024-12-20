let leaderboard = [];

function generateLixiAmount() {
    const luck = Math.random();
    const amount = luck > 0.8 ? Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000 : Math.floor(Math.random() * (20000 - 1000 + 1)) + 1000;
    return amount;
}

document.getElementById("submitBtn").addEventListener("click", function() {
    const name = document.getElementById("nameInput").value.trim();
    const key = document.getElementById("keyInput").value.trim();

    if (name === "" || key === "") {
        alert("Vui lòng nhập đầy đủ tên và mã!");
        return;
    }

    // Gửi yêu cầu mở lì xì
    fetch("http://localhost:3000/open-lixi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, key: key })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("resultMessage").innerText = data.message;

        const amount = data.balance; // Cập nhật số dư sau khi nhận lì xì
        leaderboard.push({ name, amount });
        leaderboard.sort((a, b) => b.amount - a.amount);

        if (leaderboard.length > 10) {
            leaderboard = leaderboard.slice(0, 10);
        }

        updateLeaderboard();
    })
    .catch(err => alert("Lỗi: " + err));
});

function updateLeaderboard() {
    const leaderboardList = document.getElementById("leaderboardList");
    leaderboardList.innerHTML = "";
    leaderboard.forEach((entry, index) => {
        const li = document.createElement("li");
        li.innerText = `${index + 1}. ${entry.name} - ${entry.amount}đ`;
        leaderboardList.appendChild(li);
    });
}
