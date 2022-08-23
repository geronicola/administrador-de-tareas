// Botones
const btnAdd = document.getElementById("add-category");
const deleteCategory = document.getElementById("delete-category")
const showCategory = document.getElementById("show-category")

const inputCategory = document.getElementById("category")
const selectForm = document.getElementById("form-select")

const table = document.getElementById("table")
const tbody = document.getElementById("tbody")

let datos = null

fetch('http://localhost:3000/categorias')
    .then(result => {
        return result.json()
    })
    .then(categories => {
        console.log(categories);
        categories.forEach(category => {
            console.log(category)
            const option = document.createElement("option")
            option.id = category.id
            option.textContent = category.nombre;
            option.value = category.nombre
            selectForm.appendChild(option)
        });
    })
    


let i = 1;


// Agregar una categoria a la lista de Opciones
btnAdd.addEventListener("click", (e) => {
    e.preventDefault()
    // Total de selects
    const options = document.querySelectorAll("option")
    let totalOptions = options.length
    console.log(totalOptions)

    const newCategory = inputCategory.value;

    const categoryOption = document.createElement("option");
    categoryOption.setAttribute("id", `category${totalOptions}`)
    categoryOption.value = newCategory
    categoryOption.textContent = newCategory
    selectForm.appendChild(categoryOption)

  
    inputCategory.value = "";

    const data = {
        id: totalOptions,
        nombre: newCategory,
    }
    console.log(newCategory)
    fetch('http://localhost:3000/categorias', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })


})

showCategory.addEventListener("click", (e)=> {
    e.preventDefault()

    mostrarCategorias()
})


selectForm.addEventListener("change", (e) => {
    console.log(e.target)
    console.log(e.target.children)
    const valorCategory =e.target.value
    // Devuelve un HTMLCollection de todos los hijos
    const children = e.target.children
    // Convertir HTMLColecction en Array
    const array = Array.prototype.slice.call( children )
    // Quedarme con el children que su value coincide con el del option seleccionado
    const result = array.filter((element) => element.value == valorCategory)
    // Me devuelve una Lista
    console.log(result[0])
    const elementRemove = result[0]
    const elementRemoveID = result[0].id

    
    // Borrar Categoria
    deleteCategory.addEventListener("click", (e) => {
        e.preventDefault();
        // Lo Remuevod el HTML
        selectForm.removeChild(elementRemove)  

        // Lo remeuvo de JSONWebServer
        fetch('http://localhost:3000/categorias/' + elementRemoveID, {
                method: 'DELETE',
            })
            .then(response => response.json()) 
            .then(res => console.log(res))
            })
    })

const mostrarCategorias = () => {
    console.log(table.className)
    table.classList.toggle("d-none")
    const options = document.querySelectorAll("option")
    console.log(options)
    let contador = 1
    // Vaciar el tbody Previo
    tbody.innerHTML = "";
    options.forEach(element => {
       
        if(element.value !== "Seleccionar Categoria"){
            console.log(element.value)
            let crearTable = `
            <tr>
                <th scope="row">${contador}</th>
                <td>${element.value}</td>
            </tr>
    
        `
        tbody.innerHTML += crearTable
        contador++
        }
    });
}


