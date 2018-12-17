<template>
    <div class="text-xs-center">
        <v-progress-circular
            :rotate="-90"
            :size="size"
            :width="15"
            :value="value"
            :color="color"
        >
            {{ getTimeLeft(value) }}
        </v-progress-circular>
    </div>
</template>

<script>
export default {
    props: {
        time: {
            type: Number,
            default: 0,
        },
        color: {
            type: String,
            default: 'black',
        },
        startValue: {
            type: Number,
            default: 0,
        },
        size: {
            type: String,
            default: "100",
        }
    },
    data() {
        return {
            value: 0,
            interval: null,
            intervalTime: 1000,
        }
    },
    beforeDestroy () {
        this.clearInterval();
    },
    mounted() {
        this.clearInterval();
        this.setValue();
        this.setTimer();
    },
    watch: {
        startValue() {
            this.clearInterval();
            this.setValue();
            this.setTimer();
        }
    },
    methods: {
        setValue() {
            this.value = this.msecondsToValue(new Date().getTime() - this.startValue);
            // console.log('setValue', this.value, this.startValue, this.formatTime(this.startValue));
        },
        msecondsToValue(mseconds=0) {
            return this.time === 0 ? 0 : 100 * mseconds / this.time;
        },
        valueToMseconds(value) {
            return value * this.time / 100;
        },
        setTimer() {
            if (!this.time) return;

            this.valueIncrement = 100 * this.intervalTime / this.time;

            this.interval = setInterval(() => {
                if (this.value >= 100) {
                    this.$emit('timer-end');
                    this.clearInterval();
                    return;
                }
                this.value += this.valueIncrement;
            }, this.intervalTime);
        },
        clearInterval() {
            if (this.interval) clearInterval(this.interval);
        },
        getTimeLeft: function(value) {
            let mseconds = this.valueToMseconds(value || this.value);
            return this.formatTime(this.time - mseconds);
        },
        formatTime: (mseconds) => {
            let seconds = Math.max(Math.floor(mseconds / 1000), 0);
            let minutes = Math.max(Math.floor(seconds / 60), 0);
            return `${minutes > 0 ? minutes + ' min ' : ''}${seconds - minutes * 60} sec`;
        }
    }
}
</script>
