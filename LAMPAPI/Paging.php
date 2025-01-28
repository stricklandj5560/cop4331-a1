<?php
	header("Access-Control-Allow-Origin: *");
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
            return;
        }

		$stmtCount = $conn->prepare("SELECT COUNT(*) AS totalContacts FROM Contacts WHERE UserID = ?"); 
		$stmtCount->bind_param("i", $inData["UserID"]); 
		$stmtCount->execute();
        $resultCount = $stmtCount->get_result();

        returnWithError("rowcount: " . print_r($rowCount, true));

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
            return;
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
    function returnWithInfo($contactsData, $totalPages, $currentPage)
    {
        $retValue = '{"results":[' . $contactsData . '],"totalPages":' . $totalPages . ',"currentPage":' . $page . ',"error":""}';
        sendResultInfoAsJson($retValue);
    }


?>

