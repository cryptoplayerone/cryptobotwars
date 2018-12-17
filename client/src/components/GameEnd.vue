<template>
    <div>
        Game Over.
        {{ move }} won.
        {{ amount }} raised.
        {{ players }} played.
    </div>
</template>

<script>
export default {
    props: ['move', 'amount','players'],
}
</script>
