const calculateFine = (returnDate, dueDate) => {
    const dailyFineRate = 1000; // Misal denda harian 1000
    const diffTime = returnDate - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * dailyFineRate : 0;
  };
  
  module.exports = calculateFine;
  