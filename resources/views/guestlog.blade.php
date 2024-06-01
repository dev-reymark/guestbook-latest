<!DOCTYPE html>
<html>

<head>
    <title>Guests Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .header,
        .footer {
            background-color: #f2f2f2;
            padding: 10px;
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Guests Log Report</h1>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Guest Name</th>
                    <th>Meeting With</th>
                    <th>Purpose of Visit</th>
                    <th>Check-in Time</th>
                    <th>Check-out Time</th>
                </tr>
            </thead>
            <tbody>
                @foreach($guests as $guest)
                <tr>
                    <td>{{ $guest->guest->name }}</td>
                    <td>{{ $guest->meeting_with }}</td>
                    <td>{{ $guest->purpose_of_visit }}</td>
                    <td>{{ $guest->check_in_time }}</td>
                    <td>{{ $guest->check_out_time }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="footer">
            <p>Datalogic Systems Corporation</p>
        </div>
    </div>
</body>

</html>