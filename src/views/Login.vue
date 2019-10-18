<template>
    <!-- <v-app id="inspire"> -->
      <v-container grid-list-xl>
        <!-- v-flex -->
        <v-flex style="position: relative; margin-top: 90px; text-align: center;">
          <div id="logo"><span><h1 class="blue-text logo-letter fade-in-infinite">AD</h1></span></div>
        </v-flex>

        <v-layout>
          <v-flex xs12 md4 offset-md4 mt-5 style="position: absolute; top: 290px; left: 0; right: 0;">
            <v-form ref="form" @submit.prevent="handleLogin" v-model="valid" lazy-validation value="valid">
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                :error-messages="error.username"
                label="Email or Username"
                color="blue"
                prepend-icon="mdi-account"
                @keydown="textInput(1)"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :error-messages="error.password"
                label="Password"
                color="blue"
                prepend-icon="mdi-lock"
                @keydown="textInput(2)"
                centered
                type="password"
                required
              ></v-text-field>
              <v-btn :disabled="!valid" color="blue" type="submit" style="color: #fff !important;" block round>LOGIN</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    <!-- </v-app> -->
</template>

<script>
import { mapMutations } from 'vuex'

export default {
    data: () => ({
      valid: false,
      username: '',
      password: '',
      usernameRules: [
        v => !!v || 'Username is required',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      error: {
        username: '',
        password: ''
      }
    }),
    methods: {
      ...mapMutations('app', ['setDrawer', 'setSnackbar']),

      handleLogin () {
        if (this.$refs.form.validate()) {

          this.$store.dispatch('authenticate', { username: this.username, password: this.password }).then(res => {
            localStorage.setItem('drawer', true)
            this.setDrawer(true)
          })
          .catch(error => {
            if (error.type === 1)
              this.error.username = error.msg
            else
              this.error.password = error.msg
          })
        }
      },

      textInput (type) {
        if (type === 1){
          if(this.error.username !== '')
            this.error.username = ''
        }
        else{
          if(this.error.password !== '')
            this.error.password = ''
        } 
      }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Dosis');

#logo {
  position: relative;
  width: 200px; 
  height: 115.47px;
  background-color: #1a2631;
  margin: 11% auto;
  box-shadow: 0 0 30px rgba(0,0,0,0.6);
  border-left: solid 5px #2196f3;
  border-right: solid 5px #2196f3;;
  border-radius: 5px;
}

#logo:before,
#logo:after {
  content: "";
  position: absolute;
  z-index: 1;
  width: 141.42px;
  height: 141.42px;
  -webkit-transform: scaleY(0.5774) rotate(-45deg);
  -ms-transform: scaleY(0.5774) rotate(-45deg);
  transform: scaleY(0.5774) rotate(-45deg);
  background-color: inherit;
  left: 24.2893px;
  box-shadow: 0 0 30px rgba(0,0,0,0.6);
  border-radius: 7px;
}

#logo:before {
  top: -70.7107px;
  border-top: solid 7.0711px #2196f3;
  border-right: solid 7.0711px #2196f3;
}

#logo:after {
  bottom: -70.7107px;
  border-bottom: solid 7.0711px #2196f3;
  border-left: solid 7.0711px #2196f3;
}

/*cover up extra shadows*/
#logo span {
  display: block;
  position: absolute;
  top: 2.8867513459481287px;
  left: 0;
  width:190px;
  height:109.6966px;
  z-index: 2;
  background: inherit;
}

.logo-letter{
  position: absolute;
  /* right: 216px; */
  margin-top: -15px;
  margin-left: 26px;
  font-size: 7em !important;
  color: #2196f3;
  z-index: 3;
  /* transform: translateX(-65px); */
  font-family: 'Dosis', sans-serif;
  text-shadow: 0 2px 10px rgba(0,0,0,0.6);
}

.fade-in-infinite{
  transition: all 0.4s;
  animation: fadein1 2s ease-in-out infinite alternate;
}

@keyframes fadein1 {
  0%{
      transform: translateY(10px);
  }
  100%{
      transform: translateY(-10px);
  }
}
</style>
