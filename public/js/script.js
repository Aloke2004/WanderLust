(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("search was initialized");
    const searchQuery = document.getElementById('searchInput').value;

    if (searchQuery.trim()) {
      console.log('Search query:', searchQuery);
    } else {
      alert('Please enter a destination to search.');
    }
  });