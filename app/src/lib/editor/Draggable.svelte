<script lang="ts">
  const {
    class: css,
    children,
    handleName,
    move,
    index: i,
    dragState,
  } = $props();
  let canDrag = $state(false);
</script>

<div
  class={css}
  role="application"
  class:dragging={dragState.dragIndex === i}
  class:drop-target={dragState.dropIndex === i}
  draggable={canDrag}
  ondragstart={() => (dragState.dragIndex = i)}
  ondragend={() => {
    dragState.dragIndex = null;
    dragState.dropIndex = null;
    canDrag = false;
  }}
  ondragover={(e) => {
    e.preventDefault();
    dragState.dropIndex = i;
  }}
  ondrop={(e) => {
    e.preventDefault();
    if (dragState.dragIndex !== null) move(dragState.dragIndex, i);
    dragState.dragIndex = null;
    dragState.dropIndex = null;
  }}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <span
    class="drag-handle"
    onmousedown={() => (canDrag = true)}
    onmouseup={() => (canDrag = false)}>{handleName}</span
  >
  {@render children?.()}
</div>
