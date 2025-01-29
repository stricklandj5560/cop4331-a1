<?php
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

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); //username and password

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

		$pageNumber = isset($inData['Page']) ? $inData['Page'] : 1;
		$itemsPerPage = 10;
		$offset = ($pageNumber - 1) * $itemsPerPage;

		$stmt = $conn->prepare("select * from Contacts where (FirstName like ? OR LastName like ? OR Phone like ? OR Email like ?) and UserID = ? ORDER BY LastName"); //search based on whatever user would like
		$searchName = "%" . $inData["Search"] . "%";  //lowercase "search" when testing
		$stmt->bind_param("ssssi", $searchName, $searchName, $searchName, $searchName, $inData["UserID"]); // "userId" when testing
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"FirstName":"' . $row["FirstName"] . '","LastName":"' . $row["LastName"] . '","Phone":"' . $row["Phone"] . '","Email":"' . $row["Email"] . '","UserID":"' . $row["ID"] . '"}'; //provides a json object of the contact
		}
		



		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			$stmtTotal = $conn->prepare("
			SELECT COUNT(*) AS total FROM Contacts 
			WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) 
			AND UserID = ?");
			$stmtTotal->bind_param("ssssi", $searchName, $searchName, $searchName, $searchName, $inData["userId"]);
			$stmtTotal->execute();
			$resultTotal = $stmtTotal->get_result();
			$totalRecords = $resultTotal->fetch_assoc()['total'];

			$totalPages = ceil($totalRecords / $itemsPerPage);
			 
			returnWithInfo($searchResults, $totalRecords, $totalPages, $pageNumber);
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($searchResults, $totalRecords, $totalPages, $pageNumber)
	{
		// Fix the missing quote and commas in the JSON string
		$retValue = '{"results":[' . json_encode($searchResults) . '], "totalRecords":' . $totalRecords . ', "totalPages":' . $totalPages . ', "pageNumber":' . $pageNumber . ', "error":""}';
		sendResultInfoAsJson($retValue);
	}
	
	
?>
