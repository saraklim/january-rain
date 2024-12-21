export const getRandomColor = () => {
    return `hsl(${Math.random() * 360}, 100%, 75%)`;
  };
  
  export const calculateDotPositions = (dots) => {
    // Configuration
    const dotsPerRow = 8;
    const rowHeight = 15;
    const margin = 10;
    const usableWidth = 100 - (2 * margin);
    const verticalTransitionHeight = rowHeight / 2;
  
    // Calculate total path length
    const calculateTotalPathLength = () => {
      const numRows = Math.ceil(dots.length / dotsPerRow);
      const horizontalSegments = numRows;
      const verticalSegments = numRows - 1;
      
      return (horizontalSegments * usableWidth) + (verticalSegments * verticalTransitionHeight);
    };
  
    // Calculate position along the path given a percentage (0-1)
    const getPositionAlongPath = (percentage) => {
      const totalLength = calculateTotalPathLength();
      const targetDistance = percentage * totalLength;
      
      let distanceCovered = 0;
      let currentRow = 0;
      
      while (distanceCovered <= targetDistance) {
        // Check if we're in a horizontal segment
        const horizontalLength = usableWidth;
        if (targetDistance <= distanceCovered + horizontalLength) {
          // Position is on this horizontal segment
          const segmentPercentage = (targetDistance - distanceCovered) / horizontalLength;
          const xPos = margin + (currentRow % 2 === 0 ? 
            segmentPercentage * usableWidth : 
            (1 - segmentPercentage) * usableWidth
          );
          return {
            x: xPos,
            y: margin + (currentRow * rowHeight)
          };
        }
        distanceCovered += horizontalLength;
        
        // Check if we need to add a vertical segment
        if (currentRow < Math.ceil(dots.length / dotsPerRow) - 1) {
          const verticalLength = verticalTransitionHeight;
          if (targetDistance <= distanceCovered + verticalLength) {
            // Position is on this vertical segment
            const segmentPercentage = (targetDistance - distanceCovered) / verticalLength;
            const xPos = margin + (currentRow % 2 === 0 ? usableWidth : 0);
            return {
              x: xPos,
              y: margin + (currentRow * rowHeight) + (segmentPercentage * verticalTransitionHeight)
            };
          }
          distanceCovered += verticalLength;
        }
        
        currentRow++;
      }
      
      // Fallback for last position
      const lastRow = Math.floor((dots.length - 1) / dotsPerRow);
      return {
        x: margin + (lastRow % 2 === 0 ? usableWidth : 0),
        y: margin + (lastRow * rowHeight)
      };
    };
  
    // Calculate time-based positions
    const timestamps = dots.map(dot => new Date(dot.dateTime).getTime());
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const totalTimeSpan = maxTime - minTime;
  
    return dots.map((dot) => {
      const dotTime = new Date(dot.dateTime).getTime();
      const timePercentage = (dotTime - minTime) / totalTimeSpan;
      const position = getPositionAlongPath(timePercentage);
  
      return {
        ...dot,
        color: dot.color || getRandomColor(),
        random: {
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5
        },
        chronological: {
          x: position.x,
          y: position.y
        }
      };
    });
  };
  
  // Keep the existing getTimeDifference utility function
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