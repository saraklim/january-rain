export const getRandomColor = () => {
    return `hsl(${Math.random() * 360}, 100%, 75%)`;
  };
  
  export const calculateDotPositions = (dots) => {
    // Configuration
    const dotsPerRow = 8;
    const rowHeight = 15;
    const margin = 10;
    const usableWidth = 100 - (2 * margin);
    const verticalTransitionHeight = rowHeight / 2; // Height of vertical transition
    
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
      
      if (currentRow.length === dotsPerRow || index === dots.length - 1) {
        rows.push(currentRow);
        currentRow = [];
      }
    });
    
    return dots.map((dot, index) => {
      const rowIndex = Math.floor(index / dotsPerRow);
      const isEvenRow = rowIndex % 2 === 0;
      const currentRow = rows[rowIndex];
      const dotTime = new Date(dot.dateTime).getTime();
      
      // Find position within row based on timestamp
      const rowStartTime = Math.min(...currentRow.map(d => new Date(d.dateTime).getTime()));
      const rowEndTime = Math.max(...currentRow.map(d => new Date(d.dateTime).getTime()));
      const rowTimeSpan = rowEndTime - rowStartTime || 1;
      
      // Calculate position within the row (0 to 1)
      let xPercentageInRow = (dotTime - rowStartTime) / rowTimeSpan;
      
      // Determine if this dot is in a transition zone
      const isLastInRow = (index + 1) % dotsPerRow === 0;
      const isFirstInRow = index % dotsPerRow === 0;
      
      let xPercentage, yPercentage;
      
      if (isLastInRow && index !== dots.length - 1) {
        // This dot is transitioning to the next row
        xPercentage = margin + (isEvenRow ? usableWidth : 0);
        
        // Calculate progress through the vertical transition
        const nextRowStartTime = new Date(dots[index + 1].dateTime).getTime();
        const transitionProgress = Math.min(1, (dotTime - rowStartTime) / (nextRowStartTime - rowStartTime));
        
        // Apply vertical transition
        yPercentage = margin + (rowIndex * rowHeight) + (transitionProgress * verticalTransitionHeight);
      } else if (isFirstInRow && index !== 0) {
        // This dot is completing the transition from the previous row
        xPercentage = margin + (isEvenRow ? 0 : usableWidth);
        
        // Calculate progress through the vertical transition
        const prevRowEndTime = new Date(dots[index - 1].dateTime).getTime();
        const transitionProgress = (dotTime - prevRowEndTime) / (rowEndTime - prevRowEndTime);
        
        // Apply vertical transition
        yPercentage = margin + ((rowIndex - 0.5) * rowHeight) + (transitionProgress * verticalTransitionHeight);
      } else {
        // Normal horizontal movement
        if (!isEvenRow) {
          xPercentageInRow = 1 - xPercentageInRow;
        }
        xPercentage = margin + (xPercentageInRow * usableWidth);
        yPercentage = margin + (rowIndex * rowHeight);
      }
      
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