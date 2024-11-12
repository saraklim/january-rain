export const getRandomColor = () => {
    return `hsl(${Math.random() * 360}, 100%, 75%)`;
  };
  
  export const calculateDotPositions = (dots) => {
    // Configuration
    const dotsPerRow = 8;
    const rowHeight = 15;
    const margin = 10;
    const usableWidth = 100 - (2 * margin);
    
    // First, calculate time differences
    const timestamps = dots.map(dot => new Date(dot.dateTime).getTime());
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const totalTimeSpan = maxTime - minTime;
    
    // Group dots by rows while maintaining temporal relationships
    const rows = [];
    let currentRow = [];
    let currentRowTimeSpan = 0;
    const timePerRow = totalTimeSpan / Math.ceil(dots.length / dotsPerRow);
    
    dots.forEach((dot, index) => {
      currentRow.push({
        ...dot,
        timestamp: new Date(dot.dateTime).getTime()
      });
      
      // Start new row if we hit max dots per row or next dot would exceed time span
      if (currentRow.length === dotsPerRow || index === dots.length - 1) {
        rows.push(currentRow);
        currentRow = [];
      }
    });
    
    // Calculate positions for each dot
    return dots.map((dot, index) => {
      const rowIndex = Math.floor(index / dotsPerRow);
      const isEvenRow = rowIndex % 2 === 0;
      const currentRow = rows[rowIndex];
      const dotTime = new Date(dot.dateTime).getTime();
      
      // Find position within row based on timestamp
      const rowStartTime = Math.min(...currentRow.map(d => new Date(d.dateTime).getTime()));
      const rowEndTime = Math.max(...currentRow.map(d => new Date(d.dateTime).getTime()));
      const rowTimeSpan = rowEndTime - rowStartTime || 1; // Prevent division by zero
      
      // Calculate x position based on time within the row
      let xPercentageInRow = (dotTime - rowStartTime) / rowTimeSpan;
      if (!isEvenRow) {
        xPercentageInRow = 1 - xPercentageInRow; // Reverse for odd rows
      }
      
      // Apply margins to x position
      const xPercentage = margin + (xPercentageInRow * usableWidth);
      
      // Calculate y position
      const yPercentage = margin + (rowIndex * rowHeight);
      
      return {
        ...dot,
        color: getRandomColor(),
        random: {
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5
        },
        chronological: {
          x: xPercentage,
          y: yPercentage
        }
      };
    });
  };
  
  // Utility function to format time differences for tooltips
  export const getTimeDifference = (date1, date2) => {
    const diff = Math.abs(new Date(date1) - new Date(date2));
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} apart`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} apart`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} apart`;
    return 'Less than a minute apart';
  };