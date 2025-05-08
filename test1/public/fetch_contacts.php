<?php
// Configurar encabezados para JSON
header('Content-Type: application/json');

// Credenciales de la base de datos - REEMPLAZA CON TUS CREDENCIALES REALES
$servername = "localhost"; // Usualmente "localhost"
$username = "root"; // Tu nombre de usuario de MySQL
$password = ""; // Tu contraseña de MySQL
$dbname = "portsaplaya"; // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    // Enviar respuesta de error JSON
    echo json_encode(["error" => "Error de conexión a la base de datos: " . $conn->connect_error]);
    exit();
}

// Consulta SQL para seleccionar todos los mensajes de contacto
// Ordenar por fecha de envío descendente para ver los más recientes primero
$sql = "SELECT id, name, email, phone, preferred_date, message, privacy_consent, submission_time FROM contact_messages ORDER BY submission_time DESC";
$result = $conn->query($sql);

$contacts = [];

if ($result->num_rows > 0) {
    // Recorrer los resultados y añadirlos al array
    while($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }
}

// Cerrar conexión
$conn->close();

// Enviar los datos en formato JSON
echo json_encode($contacts);
?>