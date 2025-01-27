<?php

	$inData = getRequestInfo();
	
	$contactsData = "";
    $totalContacts = 0;
    $totalPages = 0; //for frontend to know

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
	
    function returnWithInfo($contactsData, $totalPages, $page)
    {
        $retValue = '{"results":[' . $contactsData . '],"totalPages":' . $totalPages . ',"currentPage":' . $page . ',"error":""}';
        sendResultInfoAsJson($retValue);
    }
    
	
?>
