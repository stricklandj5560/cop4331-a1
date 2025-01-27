<?php
	/*header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization");

	if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
		header("HTTP/1.1 200 OK");
		exit(0);
	}

	$inData = getRequestInfo();
	
	$contactsData = "";
    $totalContacts = 0;
    $totalPages = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); //username and password

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $page = isset($inData["Page"]) && is_numeric($inData["Page"]) ? (int)$inData["Page"] : 1;

        if (!isset($inData["UserID"])) //without a userid, can not look for assigned contacts
        {
            returnWithError("UserID is Required!");
        }

		$stmtCount = $conn->prepare("SELECT COUNT(*) AS totalContacts FROM Contacts WHERE UserID = ?"); 
		$stmtCount->bind_param("i", $inData["UserID"]); 
		$stmtCount->execute();
        $resultCount = $stmtCount->get_result();

        $rowCount = $resultCount->fetch_assoc(); // the amount of contacts of the userid

        // Debug the totalContacts count
        error_log("Total Contacts: " . $totalContacts);

        $totalContacts = $rowCount['totalContacts'];

        $rowsPerPage = 10;
        $totalPages = ceil($totalContacts / $rowsPerPage); //amount of pages that user has of contacts
        
        // Ensure the page number is within valid range
        $page = max(1, min($page, $totalPages)); // Ensure page is within valid range

        // Calculate OFFSET for the current page
        $offset = ($page - 1) * $rowsPerPage;

        //fetch the contact information
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID = ? LIMIT ? OFFSET ?");
        $stmt->bind_param("iii", $inData["UserID"], $rowsPerPage, $offset);
        $stmt->execute();
        $result = $stmt->get_result();

        

        $contactCount = 0;
        while ($row = $result->fetch_assoc()) {
            if ($contactCount > 0) {
                $contactsData .= ",";
            }
            $contactCount++;
            $contactsData .= '{"FirstName":"' . $row["FirstName"] . '","LastName":"' . $row["LastName"] . '","Phone":"' . $row["Phone"] . '","Email":"' . $row["Email"] . '","UserID":"' . $row["UserID"] . '"}';
        }

        error_log("Contact Count: " . $contactCount); // Debug contact count

        if ($contactCount == 0) {
            returnWithError("No Contacts Found");
        } else {
            returnWithInfo($contactsData, $totalPages, $page);
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
		$retValue = '{"results":[],"totalPages":0,"currentPage":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
    function returnWithInfo()
    {
        $retValue = '{"results":[' . $contactsData . '],"totalPages":' . $totalPages . ',"currentPage":' . $page . ',"error":""}';
        sendResultInfoAsJson($retValue);
    }*/
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization");

	if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
		header("HTTP/1.1 200 OK");
		exit(0);
	}

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;
	$totalPages = 0;
	$currentPage = 1;

	// Check if page is provided, otherwise default to 1
	if (isset($inData['page']) && is_numeric($inData['page'])) {
		$currentPage = (int)$inData['page'];
	}
	
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); // Database connection

	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
	} else {
		// First, get the total count of matching contacts
		$stmtCount = $conn->prepare("SELECT COUNT(*) AS totalContacts FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID = ?");
		$searchName = "%" . $inData["search"] . "%";  
		$stmtCount->bind_param("ssssi", $searchName, $searchName, $searchName, $searchName, $inData["userId"]);
		$stmtCount->execute();
		$resultCount = $stmtCount->get_result();
		$rowCount = $resultCount->fetch_assoc();
		$totalContacts = $rowCount['totalContacts'];

		// Calculate the total number of pages
		$rowsPerPage = 10;
		$totalPages = ceil($totalContacts / $rowsPerPage);

		// Ensure current page is within range
		$currentPage = max(1, min($currentPage, $totalPages));

		// Calculate OFFSET for SQL query
		$offset = ($currentPage - 1) * $rowsPerPage;

		// Fetch contacts for the current page
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID = ? ORDER BY LastName ASC LIMIT ? OFFSET ?");
		$stmt->bind_param("ssssiii", $searchName, $searchName, $searchName, $searchName, $inData["userId"], $rowsPerPage, $offset);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc()) {
			if ($searchCount > 0) {
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"FirstName":"' . $row["FirstName"] . '","LastName":"' . $row["LastName"] . '","Phone":"' . $row["Phone"] . '","Email":"' . $row["Email"] . '","UserID":"' . $row["UserID"] . '"}';
		}
		
		// If no results found, return an error
		if ($searchCount == 0) {
			returnWithError("No Records Found");
		} else {
			returnWithInfo($searchResults, $totalPages, $currentPage);
		}
		
		$stmt->close();
		$conn->close();
	}

	// Helper functions
	function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj) {
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err) {
		$retValue = '{"results":[],"totalPages":0,"currentPage":0,"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithInfo($searchResults, $totalPages, $currentPage) {
		$retValue = '{"results":[' . $searchResults . '],"totalPages":' . $totalPages . ',"currentPage":' . $currentPage . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}
?>

