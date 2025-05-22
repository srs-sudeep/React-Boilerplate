import React, { useEffect, useState } from 'react'
import { Avatar, Badge, Box, Typography, Grid } from '@mui/material'
import { getAllUsers } from 'api'
import { styled } from '@mui/system'
import dayjs from 'dayjs'

// Styled component for the leaderboard header
const StyledHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}))

// Medal colors for top 3
const getMedalColor = (index) => {
  switch (index) {
    case 0:
      return '#FFD700' // Gold
    case 1:
      return '#C0C0C0' // Silver
    case 2:
      return '#CD7F32' // Bronze
    default:
      return null
  }
}

// Helper function to filter history for the last month
const getLastMonthHistoryCount = (history) => {
  const lastMonthStart = dayjs().subtract(1, 'month').startOf('month')
  const lastMonthEnd = dayjs().subtract(1, 'month').endOf('month')

  return history.filter(({ issueDate }) => {
    const date = dayjs(issueDate)
    return date.isAfter(lastMonthStart) && date.isBefore(lastMonthEnd)
  }).length
}

const Leaderboard = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers()
        // Filter out 'admin' and 'librarian' users
        const filteredUsers = response.filter(
          (user) => user.role !== 'admin' && user.role !== 'librarian',
        )

        // Sort users by their last month's history count in descending order
        const sortedUsers = filteredUsers.sort((a, b) => {
          const aHistoryCount = getLastMonthHistoryCount(a.history)
          const bHistoryCount = getLastMonthHistoryCount(b.history)
          return bHistoryCount - aHistoryCount
        })

        setUsers(sortedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  return (
    <Box p={4}>
      {/* Leaderboard Header */}
      <StyledHeader>
        <Typography variant="subtitle1" color="textSecondary">
          Top Users Based on Last Month's Activity
        </Typography>
      </StyledHeader>

      {/* Top 3 Winners in a Row */}
      <Box display="flex" justifyContent="center" alignItems={'end'} mb={4}>
        {/* Second position (index 1) */}
        {users[1] && (
          <Box key={users[1].id} textAlign="center" mx={3}>
            <Badge
              badgeContent={
                <Box
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '8px',
                  }}>
                  <img src="/silver_badge.png" alt="Silver Medal" />
                </Box>
              }
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
              <Avatar
                src={users[1].profile}
                alt={users[1].name}
                sx={{
                  width: 80,
                  height: 80,
                  border: `3px solid ${getMedalColor(1)}`, // Silver border
                }}
              />
            </Badge>
            <Typography variant="h6" mt={2}>
              {users[1].name}
            </Typography>
          </Box>
        )}

        {/* First position (index 0) */}
        {users[0] && (
          <Box key={users[0].id} textAlign="center" mx={4}>
            <Badge
              badgeContent={
                <Box
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '8px',
                  }}>
                  <img src="/gold_badge.png" alt="Silver Medal" />
                </Box>
              }
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
              <Avatar
                src={users[0].profile}
                alt={users[0].name}
                sx={{
                  width: 100, // Bigger size for the 1st place
                  height: 100,
                  border: `3px solid ${getMedalColor(0)}`, // Gold border
                }}
              />
            </Badge>
            <Typography variant="h6" mt={2}>
              {users[0].name}
            </Typography>
          </Box>
        )}

        {/* Third position (index 2) */}
        {users[2] && (
          <Box key={users[2].id} textAlign="center" mx={3}>
            <Badge
              badgeContent={
                <Box
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '8px',
                  }}>
                  <img src="/bronze_badge.png" alt="Silver Medal" />
                </Box>
              }
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
              <Avatar
                src={users[2].profile}
                alt={users[2].name}
                sx={{
                  width: 80,
                  height: 80,
                  border: `3px solid ${getMedalColor(2)}`, // Bronze border
                }}
              />
            </Badge>
            <Typography variant="h6" mt={2}>
              {users[2].name}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Leaderboard
