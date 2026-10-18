<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue'
import AppTextCarousel from '@/components/ui/AppTextCarousel.vue'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import { team, type TeamSlide } from '@/content/site'

/** Nome e cargo juntos: o cargo sozinho não identifica a pessoa numa lista de rótulos. */
const slideLabel = (slide: TeamSlide) =>
  slide.role ? `${slide.name} — ${slide.role}` : slide.name
</script>

<template>
  <SectionWrapper
    id="equipe"
    :eyebrow="team.eyebrow"
    :title="team.title"
    :subtitle="team.subtitle"
  >
    <AppTextCarousel
      data-reveal
      :items="team.slides"
      :item-label="slideLabel"
      label="Escolher quem mostrar"
      prev-label="Card anterior"
      next-label="Próximo card"
    >
      <template #default="{ item }">
        <div class="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
          <!--
            Moldura única para as quatro fotos: preta e quadrada, para a caixa
            não pular de uma ficha para outra. A foto entra inteira e centrada
            (`object-contain`): as fotos são mais altas do que largas e as
            pessoas estão bem enquadradas nelas, então cortar aproximaria demais
            o rosto — e no grupo, que é mais largo, deceparia quem encosta nas
            laterais. Como as fotos são de estúdio sobre fundo preto e a moldura
            é da mesma cor, a sobra do `contain` não aparece.
          -->
          <figure class="overflow-hidden rounded-2xl bg-neutral-950">
            <img
              :src="item.photo.src"
              :alt="item.photo.alt"
              loading="lazy"
              class="aspect-square w-full object-contain"
            />
          </figure>

          <!--
            O texto fica num card branco, como em Serviços, Local e Contato. A
            foto não tem esse painel: ela já tem moldura própria, e as duas
            caixas lado a lado repetiriam a mesma moldura duas vezes.
          -->
          <AppCard class="mx-auto max-w-md text-center sm:p-8">
            <p
              v-if="item.role"
              class="text-xs font-semibold tracking-[0.18em] text-brand-500 uppercase"
            >
              {{ item.role }}
            </p>
            <h3 class="mt-2 text-2xl">{{ item.name }}</h3>
            <p class="mt-3 text-base leading-relaxed text-ink-700">{{ item.bio }}</p>

            <ul v-if="item.tags?.length" class="mt-5 flex flex-wrap justify-center gap-2">
              <li
                v-for="tag in item.tags"
                :key="tag"
                class="rounded-full bg-sand-100 px-3 py-1 text-xs font-medium text-brand-700"
              >
                {{ tag }}
              </li>
            </ul>
          </AppCard>
        </div>
      </template>
    </AppTextCarousel>
  </SectionWrapper>
</template>
