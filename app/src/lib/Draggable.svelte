<script lang="ts">
  let {
    dragging = false,
    dropTarget = false,
    ondragstart,
    ondragover,
    ondrop,
    ondragend,
    handle,
    children,
  } = $props();

  let canDrag = $state(false);
</script>

<div
  class="block"
  role="application"
  class:dragging
  draggable={canDrag}
  class:drop-target={dropTarget}
  ondragover={(e) => {
    e.preventDefault();
    ondragover?.();
  }}
  ondrop={(e) => {
    e.preventDefault();
    ondrop?.();
  }}
  {ondragstart}
  ondragend={(e) => {
    canDrag = false;
    ondragend?.(e);
  }}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <span
    class="drag-handle"
    onmousedown={() => (canDrag = true)}
    onmouseup={() => (canDrag = false)}
  >
    {@render handle?.()}
  </span>
  {@render children?.()}
</div>

<style>
  .block {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: flex-start;
    transition: border-color 0.15s;
    border: 1px solid #eee;
    border-radius: 8px;
    background: white;
    padding: 0.75rem;

    &:hover {
      border-color: #ddd;
    }

    &:focus-within {
      border-color: #4a9eff;
    }

    &.dragging {
      opacity: 0.3;
    }

    &.drop-target {
      border-color: #4a9eff;
    }

    .drag-handle {
      flex-shrink: 0;
      cursor: grab;
      padding-top: 4px;
      width: 60px;
      color: #aaa;
      font-size: 10px;
      letter-spacing: 0.05em;
      text-transform: uppercase;

      &:active {
        cursor: grabbing;
      }
    }

    :last-child {
      margin: 0;
      width: 100%;

      &:focus {
        outline: none;
      }
    }
  }
</style>
