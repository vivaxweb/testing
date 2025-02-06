document.addEventListener("DOMContentLoaded", function () {
    let students = [];

   
    fetch("./final_data.csv")
        .then(response => response.text())
        .then(data => {
            let rows = data.split("\n").slice(1); 
            students = rows.map(row => {
                let [id, name] = row.split(",");
                return { id: id.trim(), name: name.trim().toLowerCase() };
            });
        })
        .catch(error => console.error("Error loading student list:", error));

    
    function searchStudent(query) {
        query = query.toLowerCase().trim();
        let found = students.find(student => student.id === query || student.name.includes(query));

        let resultDiv = document.getElementById("result");
        if (found) {
            resultDiv.innerHTML = `✅ Student Found: <b>${found.name}</b> (ID: ${found.id})`;
            resultDiv.style.color = "green";
        } else {
            resultDiv.innerHTML = "❌ Student Not Found";
            resultDiv.style.color = "red";
        }
    }

    document.getElementById("searchForm").addEventListener("submit", function (e) {
        e.preventDefault();
        let query = document.getElementById("searchInput").value;
        searchStudent(query);
    });

    // document.getElementById("reloadBtn").addEventListener("click", function () {
    //     document.getElementById("searchInput").value = "";
    //     document.getElementById("result").innerHTML = "";
    // });

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
        document.getElementById("idNumber").value = id;
    }

    function submitForm() {
        alert("Form submitted with ID: " + document.getElementById("idNumber").value);
    }
});
