<script lang="ts">
  import { parse, stringify } from "yaml";

  let { node = $bindable() } = $props();
  const properties = $derived<Record<string, string>>(
    parse(node.value || "") || {},
  );

  function updateProperty(value, key) {
    properties[key] = value;
    node.value = stringify(properties).trimEnd();
  }

  function remove(key) {
    delete properties[key];
    node.value = stringify(properties).trimEnd();
  }
</script>

<div class="block property-block">
  <span class="name">Page Properties</span>
  {#each Object.keys(properties) as key}
    <div class="property">
      <span class="label" onclick={() => remove(key)}>{key}</span>
      <input
        type="text"
        bind:value={() => properties[key], (v) => updateProperty(v, key)}
      />
    </div>
  {/each}
  <button
    onclick={() => {
      const newKey = prompt("Enter property name");
      if (newKey) {
        node.value += `\n${newKey}: `;
      }
    }}>+</button
  >
</div>

<style>
  .property-block {
    background: #d8e7e7;
    color: #636363;
    font-size: 0.8rem;

    .name {
      flex-shrink: 0;
      padding-top: 4px;
      width: 60px;
      color: #aaa;
      font-size: 10px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .property {
      display: flex;
      align-items: center;
      margin-bottom: 0.3rem;
      width: 100%;

      .label {
        position: relative;
        margin-right: 0.5rem;
        width: 100px;
        font-weight: bold;

        &::after {
          position: absolute;
          top: 50%;
          right: 10%;
          transform: translateY(-50%);
          visibility: hidden;
          opacity: 0.7;
          content: "×";
          color: #ae2d2d;
          font-size: 0.8rem;
        }

        &:hover {
          cursor: pointer;
          color: #ae2d2d;
          &::after {
            visibility: visible;
          }
        }
      }

      input {
        flex: 1;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0.25rem;
        font-size: 0.8rem;

        &:focus {
          outline: none;
          border-color: #817b7b;
        }
      }
    }

    button {
      cursor: pointer;
      border: none;
      border-radius: 4px;
      background: #817b7b;
      padding: 0.15rem 0.4rem;
      color: white;
      font-size: 0.8rem;

      &:hover {
        background: #636363;
      }
    }
  }
</style>
