<?php
// Credenciales de la base de datos - REEMPLAZA CON TUS CREDENCIALES REALES
$servername = "localhost"; // Usualmente "localhost" si la base de datos está en el mismo servidor
$username = "root"; // Tu nombre de usuario de MySQL
$password = ""; // Tu contraseña de MySQL
$dbname = "portsaplaya"; // Nombre de la base de datos creada

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    // En un entorno de producción, registra el error en lugar de mostrarlo
    // error_log("Error de conexión a la base de datos: " . $conn->connect_error);
    // Redirigir a una página de error o mostrar un mensaje genérico
    header("Location: index.html?status=error&message=db_connection_failed");
    exit();
}

// Verificar si la solicitud es POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitizar y obtener datos del formulario
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $phone = htmlspecialchars(trim($_POST['phone']));
    // La fecha se puede validar más si es necesario, pero htmlspecialchars es suficiente para prevenir XSS
    $preferred_date = $_POST['date'];
    $message = htmlspecialchars(trim($_POST['message']));
    // El checkbox envía 'on' si está marcado, o no se envía si no lo está
    $privacy_consent = isset($_POST['privacy']) ? 1 : 0; // 1 si marcado, 0 si no

    // Validación básica de campos requeridos
    if (empty($name) || empty($email) || empty($phone) || $privacy_consent == 0) {
        // Redirigir con un mensaje de error si faltan campos requeridos
        header("Location: index.html?status=error&message=required_fields_missing");
        exit();
    }

    // Preparar la consulta SQL para insertar datos
    // Se usan prepared statements para prevenir inyecciones SQL
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, phone, preferred_date, message, privacy_consent) VALUES (?, ?, ?, ?, ?, ?)");

    // Vincular parámetros (s=string, i=integer)
    $stmt->bind_param("sssssi", $name, $email, $phone, $preferred_date, $message, $privacy_consent);

    // Ejecutar la consulta
    if ($stmt->execute()) {
        // Éxito: redirigir de vuelta a la página principal con un indicador de éxito
        header("Location: index.html?status=success");
        exit();
    } else {
        // Error en la inserción: redirigir con un indicador de error
        // error_log("Error al insertar registro: " . $stmt->error); // Log del error real
        header("Location: index.html?status=error&message=db_insert_failed");
        exit();
    }

    // Cerrar statement
    $stmt->close();
} else {
    // Si no es una solicitud POST, redirigir a la página principal
    header("Location: index.html");
    exit();
}

// Cerrar conexión a la base de datos
$conn->close();
?>