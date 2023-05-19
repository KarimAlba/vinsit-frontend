<template>
    <div 
        v-bind:class="{no: !modelValue, yes: modelValue}" 
    >
        <span
            v-bind:class="{'custom-switch_no': !modelValue, 'custom-switch_yes': modelValue}" 
         />
         <input class="input" type="checkbox" :checked="isChecked" @change="updateInput"/>
    </div>
</template>
  
<script>
import _ from "lodash";

export default {
    model: {
        prop: 'modelValue',
        event: 'change'
    },
    props: {
        "modelValue": { default: "" },
        "trueValue": { default: true },
        "falseValue": { default: false }
    },
    data() {
        return {

        };
    },
    components: {

    },
    watch: {
    },
    computed: {
        isChecked() {
            if (this.modelValue instanceof Array) {
                return this.modelValue.includes(this.value)
            }
            // Note that `true-value` and `false-value` are camelCase in the JS
            return this.modelValue === this.trueValue
    }
    },
    methods: {
        updateInput(event) {
            let isChecked = event.target.checked
            if (this.modelValue instanceof Array) {
                let newValue = [...this.modelValue]
                if (isChecked) {
                newValue.push(this.value)
                } else {
                newValue.splice(newValue.indexOf(this.value), 1)
                }
                this.$emit('change', newValue)
            } else {
                this.$emit('change', isChecked ? this.trueValue : this.falseValue)
            }
        },
    },
    mounted() {
    },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

%container {
    position: relative;
    width: 34px;
    height: 18px;
    margin: 0;
    border-radius: 18px;
    
}

.no {
    background-color: #d7d9db;
    @extend %container;

    &::before {
        color: #d7d9db;
    }
}

.yes {
    background-color: #0488FD;
    @extend %container;

    &::after {
        color: #0488FD;
    }
}

.input {
    position: absolute;
    top: 0;
    left: 0;
    width: 34px;
    height: 18px;
    opacity: 0%;
    z-index: 2;
}

%custom-switch {
    position: absolute;
    width: 15.5px;
    height: 15.5px;
    top: 1px;
    display: inline-block;
    border-radius: 50%;
    background-color: #FFF;
}

.custom-switch_no {
    left: 1.5px;
    @extend %custom-switch;
}

.custom-switch_yes {
    right: 1px;
    @extend %custom-switch;
}

</style>
  