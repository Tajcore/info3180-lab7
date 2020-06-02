/* Add your Application JavaScript */
window.Bus = new  Vue();

Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload">Upload <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const FlashMessage = Vue.component('flash-messages',{
  template:`
      <div class="fixed top-0 right-0 m-6">
        <Transition name="slide-fade">
          <div v-if="message.text" :class="message.type">
            <div class="flex justify-center">
              {{ message.text }}
            </div>
          </div>
        </Transition>
      </div>
  `,
  data: function(){
    return{
      message: {
        text: null,
        type: null
      }
    };
  },


  mounted(){
    let self = this;
    let timer;
    Bus.$on('flash-message', (jsonResponse) => {

      if("message" in jsonResponse){
        self.message.text = jsonResponse.message;
        self.message.type = 'alert alert-success';
      }
      else if ("errors" in jsonResponse) {
        self.message.text = jsonResponse.errors;
        self.message.type = 'alert alert-danger';
      }

      else {
        self.message.text = "Invalid response from server!";
        self.message.type = 'alert alert-danger';
        console.log(jsonResponse);
      }

    })
  }

});

const UploadForm = Vue.component('uploadForm',{
  template: `
        <form @submit.prevent="uploadPhoto" id="uploadForm" class = "register-form border-gray box-shadow" action ='' enctype= "multipart/form-data">
          <input type="hidden" name="csrf_token" :value="csrf"/>

          <label class = "form-control-label">
          Description
          </label>
          <textarea name="description" rows="3" cols = "10" class = "form-control"></textarea>

          <label class="form-control-label">
          Photo Upload
          </label>
          <input type="file" name="photo"></input>


          <button type="submit" name="register" class="btn btn-success form-control margin-top-30">Submit</button>

        </form>
  `,
  data: function(){
    return {
      csrf: token
    }
  },

  methods: {

    uploadPhoto: function(){

      let uploadForm = document.getElementById('uploadForm');
      let form_data = new FormData(uploadForm);

      fetch("/api/upload",{
        method: 'POST',
        body: form_data,
        headers: {
         'X-CSRFToken': token
        },
        credentials: 'same-origin'
      })
      .then(function(response){
        return response.json();
      })
      .then(function(jsonResponse){
        console.log(jsonResponse);
        Bus.$emit('flash-message', jsonResponse);
      })
      .catch(function(error){
        console.log(error);
      });
    }


  }
});

const Home = Vue.component('home', {
   template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
   `,
    data: function() {
       return {}
    }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        // Put other routes here
        {path: "/upload", component: UploadForm},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});
