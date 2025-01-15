<?php
	$inData = getRequestInfo();
	
	$firstname = $inData["FirstName"];
	$lastname = $inData["LastName"];
	$login = $inData["Login"]; //only username will be lowercased by frontend
	$password = $inData["Password"]; 

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);

	} else {
		$stmt = $conn->prepare("SELECT COUNT(*) FROM Users WHERE Login = ?");
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();
		
		if ($result == 0) {
			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $firstname, $lastname, $login, $password);
			$stmt->execute();
			
			if ($stmt->affected_rows > 0) {
				returnWithError("");
			} else {
				returnWithError("failed to insert the user");
			}
		} 
		else { //login already exists!
			returnWithError("username '$login' is already taken.");
		}
		$stmt->close();
		$conn->close();
	}

	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>