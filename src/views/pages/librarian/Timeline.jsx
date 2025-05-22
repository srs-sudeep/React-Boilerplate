import { getAllBooks, getIndiBook, getIndiUser } from 'api';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';

const Timeline = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllBooks();
      const allEntries = mergeAndSortAllBooks(data);
      const withDetails = await fetchDetailsForEntries(allEntries);
      setCombinedData(withDetails);
    } catch (error) {
      console.error('Error fetching books:', error.message);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const mergeAndSortAllBooks = (books) => {
    let mergedEntries = [];

    // Loop through each book and combine students and history
    books.forEach((book) => {
      mergedEntries = mergedEntries.concat(
        book.students.map((student) => ({
          userId: student.userId,
          issueDate: new Date(student.issueDate),
          bookId: book.id,
        })),
        book.history.map((entry) => ({
          userId: entry.userId,
          issueDate: new Date(entry.issueDate),
          bookId: book.id,
        }))
      );
    });

    // Sort the combined entries by issueDate
    return mergedEntries.sort((a, b) => b.issueDate - a.issueDate);
  };

  const fetchDetailsForEntries = async (entries) => {
    const promises = entries.map(async (entry) => {
      const user = await getIndiUser(entry.userId);
      const book = await getIndiBook(entry.bookId);
      return {
        ...entry,
        userName: user.name,
        userId: user.Id,
        userEmail: user.email,
        userProfile: user.profile,
        userPhone: user.phone,
        bookTitle: book.name,
        bookAuthor: book.author,
        bookCover: book.cover,
      };
    });
    return Promise.all(promises);
  };

  const renderTable = (data) => {
    let lastDate = null;
    let tableRows = [];
    const tablesToRender = [];

    data.forEach((entry, index) => {
      const currentDate = formatDate(entry.issueDate.toISOString().split('T')[0]);
      const isDateChanged = lastDate !== currentDate;

      if (isDateChanged && tableRows.length > 0) {
        tablesToRender.push(
          <React.Fragment key={`table-${lastDate}`}>
            <Typography variant="h3" gutterBottom style={{ marginTop: '20px', marginBottom: '20px' }}>
              {lastDate}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Book Name</TableCell>
                    <TableCell>Author</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{tableRows}</TableBody>
              </Table>
            </TableContainer>
          </React.Fragment>
        );

        tableRows = []; // Clear for the new date
        lastDate = currentDate; // Update the lastDate to the current one
      }

      // Add the current row to the collection for the current date
      tableRows.push(
        <TableRow key={`row-${index}`}>
          <TableCell>{entry.userId}</TableCell>
          <TableCell>
            <img
              src={entry.userProfile}
              alt="Profile"
              height={60}
              width={60}
              className="rounded-full"
            />
          </TableCell>
          <TableCell>{entry.userName}</TableCell>
          <TableCell>{entry.userEmail}</TableCell>
          <TableCell>{entry.userPhone}</TableCell>
          <TableCell>
            <img src={entry.bookCover} alt="Cover" height={40} width={40} />
          </TableCell>
          <TableCell>{entry.bookTitle}</TableCell>
          <TableCell>{entry.bookAuthor}</TableCell>
        </TableRow>
      );

      // After the loop completes, return the final table for the last date
      if (index === data.length - 1 && tableRows.length > 0) {
        tablesToRender.push(
          <React.Fragment key={`table-${lastDate}`}>
            <Typography variant="h3" gutterBottom style={{ marginTop: '20px', marginBottom: '20px' }}>
              {lastDate}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User ID</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Book Name</TableCell>
                    <TableCell>Author</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{tableRows}</TableBody>
              </Table>
            </TableContainer>
          </React.Fragment>
        );
      }

      lastDate = currentDate;
    });

    return tablesToRender;
  };

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className='mx-5 mb-5'>{renderTable(combinedData)}</div>
      )}
    </div>
  );
};

export default Timeline;
