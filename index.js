// Botones
const btnAdd = document.getElementById("add-category");
const deleteCategory = document.getElementById("delete-category")
const btnEdit = document.getElementById("editar-category")
const showCategory = document.getElementById("show-category")

const inputCategory = document.getElementById("category")
const selectForm = document.getElementById("form-select")

const table = document.getElementById("table")
const tbody = document.getElementById("tbody")

let datos = null
let editMode = false;

const urlBD = "http://localhost:3005/categorias"

// Traer todas las categorias de la BD - GET
const traerDatos = function() {
    fetch(urlBD)
    .then(result => {
        return result.json()
    })
    .then(categories => {
        categories.forEach(category => {
           
            const option = document.createElement("option")
            option.id = category.id
            option.textContent = category.nombre;
            option.value = category.nombre
            selectForm.appendChild(option)
            
        });  
        console.log(categories)   
    })}
traerDatos();

    
// Mostrar Todas las categorias en una tabla    
showCategory.addEventListener("click", (e)=> {
    e.preventDefault()
    
    mostrarCategorias()
})


// Guardar una categoria - Nueva Categoria / Editar Categoria
btnAdd.addEventListener("click", (e) => {
    e.preventDefault()

    if(editMode === false) {
        // Total de selects
        let idDinamico = Date.now();
        const options = document.querySelectorAll("option")
        let totalOptions = options.length
        console.log(totalOptions)
       
        // Agregar Categoria al HTML
        const newCategory = inputCategory.value;
        const categoryOption = document.createElement("option");
        categoryOption.setAttribute("id", `category${idDinamico}`)
        categoryOption.value = newCategory
        categoryOption.textContent = newCategory
        selectForm.appendChild(categoryOption)

    
        inputCategory.value = "";

        // Agregar Categoria en la API
        const data = {
            id: idDinamico,
            nombre: newCategory,
        }
        console.log(newCategory)
        fetch(urlBD, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
    } else {
        const data = {
            id: inputCategory.id,
            nombre: inputCategory.value,
        }
        editarBD(data, data.id)
        editMode = false;
    }
})

// Funcion para mandar datos de una categoria a editar
const editarBD = function (data, id) {
    fetch(`${urlBD}/${id}` , {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(data => console.log(data) )
}

// Cuando elijo una opcion puedo eliminar (DELETE) o editar (PUT)
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
        fetch(`${urlBD}/${elementRemoveID}`, {
                method: 'DELETE',
            })
            .then(response => response.json()) 
            .then(res => console.log(res))
            })


    // Editar Categoria      
    btnEdit.addEventListener("click", (e) => {
        e.preventDefault();
        editMode = true;
        // Rellenar Input a Editar
        inputCategory.value = elementRemove.value
        // Agregarle su respectivo id para luego mandarlo a la BD
        inputCategory.id = elementRemoveID
        })
    })


// Mostrar todas las Categorias
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

